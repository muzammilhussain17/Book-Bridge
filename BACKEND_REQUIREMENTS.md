# Book Bridges - API Specification & Backend Requirements

## Overview
This document outlines the required API endpoints, data models, and backend architecture needed to support the Book Bridges frontend application. The backend is expected to be built using **Spring Boot (Java)**.

## Core Architecture Requirements
- **Framework:** Spring Boot 3.x
- **Security:** Spring Security with JWT (JSON Web Tokens) for stateless authentication.
- **Database:** PostgreSQL (recommended) or MySQL for relational data.
- **ORM:** Spring Data JPA / Hibernate.
- **API Documentation:** SpringDoc OpenAPI (Swagger UI).
- **File Storage:** AWS S3 or a local filesystem wrapper for storing book images and user avatars.
- **Validation:** Jakarta Bean Validation (`@Valid`, `@NotNull`, etc.).

## Authentication & Authorization
The application uses Role-Based Access Control (RBAC) with three primary roles: `ROLE_PUBLIC`, `ROLE_USER`, and `ROLE_ADMIN`.

### Endpoints
- `POST /api/auth/login`
  - **Request Body:** `{ email, password }`
  - **Response:** `{ token, user: { id, name, email, role, avatar } }`
- `POST /api/auth/register`
  - **Request Body:** `{ name, email, password, universityEmail (optional) }`
  - **Response:** `{ message: "Registration successful" }`
- `GET /api/auth/me`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** `{ id, name, email, role, avatar }`
- `POST /api/auth/logout`
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** `{ message: "Logged out" }`

## Users API (`/api/users`)
Handles user profile management, administration, and public user profiles.

### User Endpoints
- `GET /api/users/profile` - Get current user's detailed profile.
- `PUT /api/users/profile` - Update current user's profile (name, bio, avatar).
- `PUT /api/users/security/password` - Update password.
- `GET /api/users/{id}` - Get public profile of a specific user (limited data).

### Admin Endpoints (`/api/admin/users`)
- `GET /api/admin/users` - List all users (with pagination, search, and role filtering).
- `GET /api/admin/users/{id}` - Get detailed user metrics and history.
- `POST /api/admin/users/{id}/suspend` - Toggle user suspension status.
- `POST /api/admin/users/{id}/strike` - Issue a policy violation strike.

## Books & Marketplace API (`/api/books`)
Handles book listings, searching, and filtering. Books have different transaction types: `SALE`, `DONATION`, `EXCHANGE`.

### Endpoints
- `GET /api/books` - List books (supports pagination, filtering by category, condition, type, search query).
- `GET /api/books/{id}` - Get details for a specific book.
- `POST /api/books` - Create a new book listing (requires `ROLE_USER`).
  - **Request Body:** `{ title, author, isbn, description, price (if SALE), condition, category, transactionType, imageUrls }`
- `PUT /api/books/{id}` - Update a book listing (Must be listing owner).
- `DELETE /api/books/{id}` - Delete a book listing.

### Admin Endpoints (`/api/admin/books`)
- `GET /api/admin/books/quarantine` - List books flagged for review.
- `POST /api/admin/books/{id}/approve` - Approve a quarantined book.
- `POST /api/admin/books/{id}/reject` - Reject and delete a quarantined book.

## Transactions API (`/api/transactions`)
Handles the purchasing and checkout process for books listed as `SALE` or `DONATION` (handling shipping fees if applicable).

### Endpoints
- `POST /api/transactions/checkout` - Initialize a purchase.
  - **Request Body:** `{ bookId, shippingAddress, paymentMethod }`
  - **Response:** `{ transactionId, status, totalAmount }`
- `GET /api/transactions/purchases` - List current user's purchases.
- `GET /api/transactions/sales` - List current user's sales.
- `GET /api/transactions/{id}` - Get specific transaction details (receipt).
- `PUT /api/transactions/{id}/status` - Update transaction status (e.g., `SHIPPED`, `DELIVERED` - restricted to seller).

## Exchanges API (`/api/exchanges`)
Handles the negotiation and tracking of direct book-for-book swaps.

### Endpoints
- `POST /api/exchanges/propose`
  - **Request Body:** `{ targetBookId, offeredBookId, message }`
- `GET /api/exchanges` - List user's active exchange proposals (both inbound and outbound).
- `GET /api/exchanges/{id}` - Get specific exchange thread details.
- `POST /api/exchanges/{id}/accept` - Accept an exchange proposal.
- `POST /api/exchanges/{id}/reject` - Reject an exchange proposal.

## Social & Communication API (`/api/social`)
Handles direct messages, notifications, and user ratings.

### Messaging
- `GET /api/messages/conversations` - List active message threads.
- `GET /api/messages/{conversationId}` - Get messages for a specific thread.
- `POST /api/messages/{conversationId}` - Send a new message.

### Notifications
- `GET /api/notifications` - Get unread notifications.
- `PUT /api/notifications/{id}/read` - Mark a notification as read.

### Ratings & Reviews
- `POST /api/ratings` - Submit a review for another user after completing a book deal.
  - **Request Body:** `{ targetUserId, referenceId (Transaction ID or Exchange ID), referenceType ("TRANSACTION" or "EXCHANGE"), score (1-5 int), reviewText (optional String) }`
- `GET /api/ratings/user/{userId}` - Get all public ratings for a user to calculate their overall score.

## System & Telemetry API (`/api/admin/system`)
Restricted to `ROLE_ADMIN`.

### Endpoints
- `GET /api/admin/system/stats` - Get high-level system metrics (active users, total listings, transaction volume).
- `GET /api/admin/system/violations` - Get the security incident audit log.

## AI Assistant API (`/api/ai`)
Handles the AI Chatbot responses.

### Endpoints
- `POST /api/ai/chat`
  - **Request Body:** `{ message, history }`
  - **Response:** `{ responseText, suggestedActions }`

## Data Models (Entities)
Key JPA Entities to create:
1. `User` (id, email, passwordHash, role, status, strikes, profileMetrics)
2. `Book` (id, title, author, isbn, ownerId, condition, type, price, status, imageUrl)
3. `Transaction` (id, buyerId, sellerId, bookId, amount, status, shippingDetails, createdAt)
4. `Exchange` (id, initiatorId, receiverId, offeredBookId, requestedBookId, status)
5. `Message` (id, senderId, receiverId, content, timestamp, readStatus)
6. `Rating` (id, reviewerId, targetId, transactionId, score, comment)
7. `ViolationLog` (id, userId, type, severity, resolution, timestamp)
