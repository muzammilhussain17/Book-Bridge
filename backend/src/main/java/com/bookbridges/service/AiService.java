package com.bookbridges.service;

import com.bookbridges.domain.Book;
import com.bookbridges.domain.User;
import com.bookbridges.repository.BookRepository;
import com.bookbridges.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

/**
 * AI Assistant Service for Book Bridges.
 *
 * Architecture:
 * 1. IntentDetector — Classifies the user message (BOOK_QUERY, PLATFORM_HELP,
 * USER_QUERY, GENERAL)
 * 2. ContextBuilder — Fetches relevant live DB data based on intent
 * 3. PromptBuilder — Assembles system prompt + context snippet + conversation
 * 4. GeminiClient — Executes the API call and returns response
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final GeminiClient geminiClient;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    // ─────────────────────────────────────────────────────
    // SYSTEM PROMPT
    // ─────────────────────────────────────────────────────
    private static final String BASE_SYSTEM_PROMPT = """
            You are the Book Bridges AI Assistant — a helpful, friendly, and knowledgeable assistant \
            for the Book Bridges campus textbook marketplace platform.

            ## About Book Bridges
            Book Bridges is a campus-focused platform where students can:
            - **Sell** their used textbooks and course materials to other students
            - **Donate** books for free to help fellow students
            - **Exchange** books — trade one book for another directly with peers
            - **Message** other users to coordinate pickups or ask questions
            - **Rate** other users after completing a deal
            - Track all their purchases, sales, and exchange proposals via the dashboard

            ## Your Role
            You help students navigate the platform. You can:
            1. Answer questions about how platform features work (selling, donating, exchanging, messaging, etc.)
            2. Look up whether specific books are currently listed and available
            3. Tell users about book conditions, prices, categories, and transaction types
            4. Explain the rating and review system
            5. Guide users through common tasks step-by-step

            ## Response Style
            - Be concise, warm, and friendly
            - Use bullet points for step-by-step instructions
            - If you found specific book data from the platform, present it clearly
            - If you are not sure, say so — do not make up book listings
            - Keep responses under 200 words unless detailed instructions are needed

            ## Platform Navigation
            - **List a Book**: Dashboard → "List a Book" or the "+ List" button in the nav
            - **Browse books**: Visit the Browse page, use filters for category, condition, type
            - **Exchange**: Browse → find a book with "Exchange" badge → click "Propose Exchange"
            - **Messages**: Sidebar → Messages, or click "Message Seller" on a book page
            - **My Orders**: Dashboard → Purchases tab / Sales tab
            - **Rating**: After a deal completes, a "Leave a Review" button appears on the transaction page
            """;

    // ─────────────────────────────────────────────────────
    // Intent Categories
    // ─────────────────────────────────────────────────────
    private enum Intent {
        BOOK_QUERY, // User asking about a specific book or book availability
        PLATFORM_HELP, // User asking how to use a feature
        USER_QUERY, // User asking about another user or their own profile
        GENERAL // Greeting, unclear, or general conversation
    }

    // ─────────────────────────────────────────────────────
    // PUBLIC API
    // ─────────────────────────────────────────────────────

    public record ChatRequest(String message, List<Map<String, String>> history) {
    }

    public record ChatResponse(String responseText, List<String> suggestedActions) {
    }

    public ChatResponse chat(ChatRequest request, String currentUserEmail) {
        String userMessage = request.message() != null ? request.message().trim() : "";
        if (userMessage.isBlank()) {
            return new ChatResponse("Please type a message and I will help you!", List.of());
        }

        // 1. Detect intent
        Intent intent = detectIntent(userMessage);
        log.debug("AI intent for '{}': {}", userMessage.substring(0, Math.min(50, userMessage.length())), intent);

        // 2. Build context from DB
        String dbContext = buildContext(intent, userMessage, currentUserEmail);

        // 3. Assemble system prompt
        String systemPrompt = buildSystemPrompt(dbContext);

        // 4. Convert frontend history format [{role, content}] → internal format
        List<Map<String, Object>> history = convertHistory(request.history());

        // 5. Call Gemini
        try {
            String responseText = geminiClient.chat(systemPrompt, history, userMessage);
            List<String> suggestions = buildSuggestions(intent, userMessage);
            return new ChatResponse(responseText, suggestions);
        } catch (Exception e) {
            log.error("Gemini AI chat error", e);
            return new ChatResponse(
                    "I'm having trouble connecting right now. Please try again in a moment.",
                    List.of("Browse Books", "View Dashboard"));
        }
    }

    // ─────────────────────────────────────────────────────
    // INTENT DETECTION
    // ─────────────────────────────────────────────────────

    private Intent detectIntent(String message) {
        String lower = message.toLowerCase();

        // Book availability / search keywords
        if (lower.matches(
                ".*\\b(book|isbn|author|edition|textbook|course|available|listed|find|search|looking for|do you have|is there)\\b.*")) {
            return Intent.BOOK_QUERY;
        }
        // Platform how-to keywords
        if (lower.matches(
                ".*\\b(how|sell|donate|exchange|trade|list|create|upload|buy|purchase|checkout|message|message|notification|rating|review|track|order|status|price|condition|category|profile|password|account|admin)\\b.*")) {
            return Intent.PLATFORM_HELP;
        }
        // User / profile keywords
        if (lower.matches(
                ".*\\b(user|profile|my account|my listing|my purchase|who is|seller|buyer|their rating)\\b.*")) {
            return Intent.USER_QUERY;
        }

        return Intent.GENERAL;
    }

    // ─────────────────────────────────────────────────────
    // CONTEXT BUILDER
    // ─────────────────────────────────────────────────────

    private String buildContext(Intent intent, String message, String currentUserEmail) {
        StringBuilder ctx = new StringBuilder();

        // Always add live platform stats
        try {
            long totalBooks = bookRepository.countByStatus(Book.BookStatus.ACTIVE);
            long totalUsers = userRepository.count();
            long pendingApprovals = bookRepository.countByStatus(Book.BookStatus.PENDING_APPROVAL);
            ctx.append(String.format(
                    "\n\n## Live Platform Stats\n- Active book listings: %d\n- Registered users: %d\n- Books pending approval: %d\n",
                    totalBooks, totalUsers, pendingApprovals));
        } catch (Exception e) {
            log.warn("Could not fetch platform stats for AI context", e);
        }

        // Book query — extract keywords and search DB
        if (intent == Intent.BOOK_QUERY) {
            String keyword = extractSearchKeyword(message);
            if (!keyword.isBlank()) {
                try {
                    List<Book> books = bookRepository.searchActiveBooks(keyword, PageRequest.of(0, 8));
                    if (!books.isEmpty()) {
                        ctx.append("\n\n## Available Books Matching '").append(keyword).append("'\n");
                        for (Book b : books) {
                            ctx.append(formatBookContext(b));
                        }
                    } else {
                        ctx.append("\n\n## Book Search Result\nNo active listings were found matching '")
                                .append(keyword)
                                .append("'. The user may want to check back later or browse all books.\n");
                    }
                } catch (Exception e) {
                    log.warn("DB book search failed for AI context", e);
                }
            } else {
                // Show recent books as context
                try {
                    List<Book> recent = bookRepository.findRecentActiveBooks(PageRequest.of(0, 5));
                    if (!recent.isEmpty()) {
                        ctx.append("\n\n## Recently Listed Books\n");
                        recent.forEach(b -> ctx.append(formatBookContext(b)));
                    }
                } catch (Exception e) {
                    log.warn("Could not fetch recent books for AI context", e);
                }
            }
        }

        // User query — add their own profile context if logged in
        if (intent == Intent.USER_QUERY && currentUserEmail != null) {
            try {
                Optional<com.bookbridges.domain.User> userOpt = userRepository.findByEmail(currentUserEmail);
                userOpt.ifPresent(user -> {
                    ctx.append("\n\n## Current User Profile\n");
                    ctx.append("- Name: ").append(user.getName()).append("\n");
                    ctx.append("- Email: ").append(user.getEmail()).append("\n");
                    ctx.append("- Account Status: ").append(user.getStatus()).append("\n");
                    ctx.append("- Strikes: ").append(user.getStrikes()).append("\n");
                });
            } catch (Exception e) {
                log.warn("Could not fetch user context for AI", e);
            }
        }

        return ctx.toString();
    }

    private String extractSearchKeyword(String message) {
        // Remove common question words to extract the meaningful keyword
        return message
                .replaceAll(
                        "(?i)\\b(do you have|is there|find|looking for|search for|any|available|listed|book|textbook|the|a|an|please|can you|i need|i want|i am looking for|i'm looking for)\\b",
                        "")
                .replaceAll("[?!.,]", "")
                .trim();
    }

    private String formatBookContext(Book b) {
        String price = b.getPrice() != null && b.getPrice().compareTo(BigDecimal.ZERO) > 0
                ? "$" + b.getPrice().toPlainString()
                : "Free";
        return String.format(
                "- **%s** by %s | %s | Condition: %s | Type: %s | Category: %s | ID: %d\n",
                b.getTitle(),
                b.getAuthor(),
                price,
                b.getCondition().name(),
                b.getTransactionType().name(),
                b.getCategory() != null ? b.getCategory() : "N/A",
                b.getId());
    }

    // ─────────────────────────────────────────────────────
    // PROMPT BUILDER
    // ─────────────────────────────────────────────────────

    private String buildSystemPrompt(String dbContext) {
        if (dbContext.isBlank())
            return BASE_SYSTEM_PROMPT;
        return BASE_SYSTEM_PROMPT + "\n\n---\n" +
                "## Real-Time Platform Data (Use this to answer the user accurately)\n" +
                dbContext;
    }

    // ─────────────────────────────────────────────────────
    // SUGGESTED ACTIONS
    // ─────────────────────────────────────────────────────

    private List<String> buildSuggestions(Intent intent, String message) {
        return switch (intent) {
            case BOOK_QUERY -> List.of("Browse Books", "Search by Category");
            case PLATFORM_HELP -> List.of("View Dashboard", "List a Book");
            case USER_QUERY -> List.of("View My Profile", "My Listings");
            default -> List.of("Browse Books", "View Dashboard", "List a Book");
        };
    }

    // ─────────────────────────────────────────────────────
    // HISTORY CONVERSION
    // ─────────────────────────────────────────────────────

    private List<Map<String, Object>> convertHistory(List<Map<String, String>> history) {
        if (history == null)
            return List.of();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, String> entry : history) {
            String role = entry.getOrDefault("role", "user");
            String content = entry.getOrDefault("content", "");
            if (!content.isBlank()) {
                result.add(Map.of("role", role, "content", content));
            }
        }
        return result;
    }
}
