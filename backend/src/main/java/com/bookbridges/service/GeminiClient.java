package com.bookbridges.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Low-level HTTP client for the Google Gemini REST API.
 * Uses OkHttp + Jackson for proper JSON serialization/deserialization.
 */
@Component
@Slf4j
public class GeminiClient {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.endpoint}")
    private String endpoint;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(30, java.util.concurrent.TimeUnit.SECONDS)
            .readTimeout(60, java.util.concurrent.TimeUnit.SECONDS)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    /**
     * Sends a chat request to Gemini and returns the text response.
     *
     * @param systemPrompt The system instruction text
     * @param history      The conversation history as [{role, parts:[{text}]}]
     *                     objects
     * @param userMessage  The current user message
     * @return The generated text response
     */
    public String chat(String systemPrompt, List<Map<String, Object>> history, String userMessage) throws IOException {
        if (apiKey == null || apiKey.isBlank() || apiKey.contains("your-")) {
            log.error("Gemini API key is not configured or is a placeholder");
            return "I'm not properly configured with a Google Gemini API key. Please check the backend environment variables.";
        }

        // Build the full request body using Jackson
        ObjectNode requestBody = objectMapper.createObjectNode();

        // Conversation contents
        ArrayNode contents = objectMapper.createArrayNode();

        // In v1/v1beta, the most compatible way to provide a system prompt 
        // is to prepend it to the first user message if systemInstruction field is rejected.
        String firstUserPrefix = "System Instruction: " + systemPrompt + "\n\nUser Message: ";

        // Add history (Gemini requires history to start with 'user' and alternate)
        boolean foundFirstUser = false;
        if (history != null) {
            for (Map<String, Object> entry : history) {
                String role = (String) entry.getOrDefault("role", "user");
                String text = (String) entry.getOrDefault("content", "");
                if (text.isBlank())
                    continue;

                // Gemini uses "user" and "model" roles only
                String geminiRole = "model".equals(role) ? "model" : "user";

                // Skip leading model messages
                if (!foundFirstUser && "model".equals(geminiRole)) {
                    continue;
                }

                ObjectNode contentNode = objectMapper.createObjectNode();
                contentNode.put("role", geminiRole);
                ArrayNode parts = objectMapper.createArrayNode();
                
                String finalMsg = text;
                if (!foundFirstUser) {
                    finalMsg = firstUserPrefix + text;
                }
                foundFirstUser = true;

                parts.add(objectMapper.createObjectNode().put("text", finalMsg));
                contentNode.set("parts", parts);
                contents.add(contentNode);
            }
        }

        // Add the current user message (if no user history existed, this is the first)
        ObjectNode userContent = objectMapper.createObjectNode();
        userContent.put("role", "user");
        ArrayNode userParts = objectMapper.createArrayNode();
        
        String finalUserMsg = userMessage;
        if (!foundFirstUser) {
            finalUserMsg = firstUserPrefix + userMessage;
        }
        
        userParts.add(objectMapper.createObjectNode().put("text", finalUserMsg));
        userContent.set("parts", userParts);
        contents.add(userContent);

        requestBody.set("contents", contents);

        // Generation config
        ObjectNode genConfig = objectMapper.createObjectNode();
        genConfig.put("temperature", 0.7);
        genConfig.put("maxOutputTokens", 1024);
        genConfig.put("topP", 0.95);
        requestBody.set("generationConfig", genConfig);

        // Safety settings - allow platform-relevant content
        ArrayNode safetySettings = objectMapper.createArrayNode();
        for (String category : List.of("HARM_CATEGORY_HARASSMENT", "HARM_CATEGORY_HATE_SPEECH")) {
            ObjectNode setting = objectMapper.createObjectNode();
            setting.put("category", category);
            setting.put("threshold", "BLOCK_ONLY_HIGH");
            safetySettings.add(setting);
        }
        requestBody.set("safetySettings", safetySettings);

        String bodyJson = objectMapper.writeValueAsString(requestBody);
        log.debug("Gemini request body length: {}", bodyJson.length());

        Request request = new Request.Builder()
                .url(endpoint + "?key=" + apiKey)
                .post(RequestBody.create(bodyJson, JSON))
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (response.body() == null) {
                throw new IOException("Gemini returned empty response body, status: " + response.code());
            }

            String bodyStr = response.body().string();

            if (!response.isSuccessful()) {
                log.error("Gemini API error {}: {}", response.code(), bodyStr);
                throw new IOException("Gemini API returned error: " + response.code());
            }

            // Parse response using Jackson
            JsonNode root = objectMapper.readTree(bodyStr);
            JsonNode candidates = root.path("candidates");

            if (!candidates.isArray() || candidates.isEmpty()) {
                log.warn("Gemini returned no candidates: {}", bodyStr);
                return "I could not generate a response at this time. Please try again.";
            }

            JsonNode firstCandidate = candidates.get(0);
            JsonNode content = firstCandidate.path("content");
            JsonNode parts = content.path("parts");

            if (!parts.isArray() || parts.isEmpty()) {
                return "I could not generate a response at this time. Please try again.";
            }

            return parts.get(0).path("text").asText("I could not generate a response at this time.");
        }
    }
}
