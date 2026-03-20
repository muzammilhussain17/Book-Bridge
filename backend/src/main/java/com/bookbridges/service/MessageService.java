package com.bookbridges.service;

import com.bookbridges.domain.Conversation;
import com.bookbridges.domain.Message;
import com.bookbridges.domain.User;
import com.bookbridges.exception.AppException;
import com.bookbridges.repository.ConversationRepository;
import com.bookbridges.repository.MessageRepository;
import com.bookbridges.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public List<ConversationDto> getConversations(String email) {
        User user = findUserByEmail(email);
        return conversationRepository.findByParticipant(user.getId()).stream()
                .map(c -> ConversationDto.from(c, user.getId()))
                .toList();
    }

    @Transactional
    public ConversationDto startConversation(String initiatorEmail, Long otherUserId) {
        User me = findUserByEmail(initiatorEmail);
        User other = userRepository.findById(otherUserId)
                .orElseThrow(() -> AppException.notFound("Target user not found"));

        if (me.getId().equals(other.getId())) {
            throw AppException.badRequest("Cannot start a conversation with yourself");
        }

        // Return existing conversation if one already exists between these two users
        Optional<Conversation> existing = conversationRepository.findBetween(me.getId(), other.getId());
        if (existing.isPresent()) {
            return ConversationDto.from(existing.get(), me.getId());
        }

        Conversation conv = Conversation.builder()
                .participantA(me)
                .participantB(other)
                .build();
        return ConversationDto.from(conversationRepository.save(conv), me.getId());
    }

    public List<MessageDto> getMessages(String email, Long conversationId) {
        Conversation conversation = findConversation(conversationId);
        User user = findUserByEmail(email);
        validateParticipant(user, conversation);
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream().map(MessageDto::from).toList();
    }

    @Transactional
    public MessageDto sendMessage(String email, Long conversationId, String content) {
        Conversation conversation = findConversation(conversationId);
        User sender = findUserByEmail(email);
        validateParticipant(sender, conversation);

        if (content == null || content.isBlank()) {
            throw AppException.badRequest("Message content cannot be empty");
        }

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content.trim())
                .build();
        return MessageDto.from(messageRepository.save(message));
    }

    @Transactional
    public int markAllRead(String email, Long conversationId) {
        Conversation conversation = findConversation(conversationId);
        User user = findUserByEmail(email);
        validateParticipant(user, conversation);

        List<Message> unread = messageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId)
                .stream()
                .filter(m -> !m.getSender().getId().equals(user.getId()) && !m.getIsRead())
                .toList();

        unread.forEach(m -> m.setIsRead(true));
        messageRepository.saveAll(unread);
        return unread.size();
    }

    private Conversation findConversation(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> AppException.notFound("Conversation not found"));
    }

    private void validateParticipant(User user, Conversation conv) {
        if (!conv.getParticipantA().getId().equals(user.getId()) &&
                !conv.getParticipantB().getId().equals(user.getId())) {
            throw AppException.forbidden("You are not a participant in this conversation");
        }
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> AppException.notFound("User not found"));
    }

    // --- DTOs ---
    public record ConversationDto(Long id, Long otherUserId, String otherUserName, String otherUserAvatar,
            String createdAt) {
        public static ConversationDto from(Conversation c, Long myId) {
            User other = c.getParticipantA().getId().equals(myId) ? c.getParticipantB() : c.getParticipantA();
            return new ConversationDto(c.getId(), other.getId(), other.getName(), other.getAvatarUrl(),
                    c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
        }
    }

    public record MessageDto(Long id, Long senderId, String senderName, String content, Boolean isRead,
            String createdAt) {
        public static MessageDto from(Message m) {
            return new MessageDto(m.getId(), m.getSender().getId(), m.getSender().getName(),
                    m.getContent(), m.getIsRead(), m.getCreatedAt() != null ? m.getCreatedAt().toString() : null);
        }
    }
}
