package com.bookbridges.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

/**
 * Service responsible for sending formatted HTML emails asynchronously.
 * Uses Thymeleaf templates for rich, branded email content.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${notification.from-address:Book Bridges <bookbridges.notify@gmail.com>}")
    private String fromAddress;

    @Value("${notification.email-enabled:true}")
    private boolean emailEnabled;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Send a templated notification email asynchronously.
     */
    @Async
    public void sendNotificationEmail(String toEmail, String subject, String title,
                                       String body, String type, String actionUrl) {
        if (!emailEnabled) {
            log.debug("Email notifications disabled, skipping email to {}", toEmail);
            return;
        }

        try {
            Context ctx = new Context();
            ctx.setVariable("title", title);
            ctx.setVariable("body", body);
            ctx.setVariable("type", type != null ? type : "SYSTEM");
            ctx.setVariable("actionUrl", actionUrl != null ? frontendUrl + actionUrl : frontendUrl);
            ctx.setVariable("frontendUrl", frontendUrl);
            ctx.setVariable("year", java.time.Year.now().getValue());

            String htmlContent = templateEngine.process("notification-email", ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Notification email sent to {} — subject: {}", toEmail, subject);
        } catch (MessagingException e) {
            log.error("Failed to send notification email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    /**
     * Send a welcome email to a newly registered user.
     */
    @Async
    public void sendWelcomeEmail(String toEmail, String userName) {
        if (!emailEnabled) return;

        try {
            Context ctx = new Context();
            ctx.setVariable("userName", userName);
            ctx.setVariable("frontendUrl", frontendUrl);
            ctx.setVariable("year", java.time.Year.now().getValue());

            String htmlContent = templateEngine.process("welcome-email", ctx);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Book Bridges! 📚");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent to {}", toEmail);
        } catch (MessagingException e) {
            log.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
