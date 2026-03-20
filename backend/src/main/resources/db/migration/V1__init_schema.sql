-- Book Bridges Database Schema
-- V1: Initial Schema

-- USERS
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    role        VARCHAR(20)         NOT NULL DEFAULT 'USER',
    status      VARCHAR(20)         NOT NULL DEFAULT 'ACTIVE',
    strikes     INT                 NOT NULL DEFAULT 0,
    bio         TEXT,
    avatar_url  VARCHAR(500),
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- BOOKS
CREATE TABLE books (
    id               BIGSERIAL PRIMARY KEY,
    title            VARCHAR(300)    NOT NULL,
    author           VARCHAR(200)    NOT NULL,
    isbn             VARCHAR(20),
    description      TEXT,
    price            NUMERIC(10, 2),
    condition        VARCHAR(30)     NOT NULL,
    category         VARCHAR(50),
    course_code      VARCHAR(20),
    transaction_type VARCHAR(20)     NOT NULL,
    status           VARCHAR(20)     NOT NULL DEFAULT 'PENDING_APPROVAL',
    image_url        VARCHAR(500),
    owner_id         BIGINT          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at       TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- TRANSACTIONS
CREATE TABLE transactions (
    id               BIGSERIAL PRIMARY KEY,
    buyer_id         BIGINT          NOT NULL REFERENCES users(id),
    seller_id        BIGINT          NOT NULL REFERENCES users(id),
    book_id          BIGINT          NOT NULL REFERENCES books(id),
    amount           NUMERIC(10, 2)  NOT NULL DEFAULT 0,
    status           VARCHAR(30)     NOT NULL DEFAULT 'PENDING',
    payment_method   VARCHAR(30),
    shipping_name    VARCHAR(150),
    shipping_address VARCHAR(500),
    created_at       TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- EXCHANGES
CREATE TABLE exchanges (
    id                 BIGSERIAL PRIMARY KEY,
    initiator_id       BIGINT  NOT NULL REFERENCES users(id),
    receiver_id        BIGINT  NOT NULL REFERENCES users(id),
    offered_book_id    BIGINT  NOT NULL REFERENCES books(id),
    requested_book_id  BIGINT  NOT NULL REFERENCES books(id),
    message            TEXT,
    status             VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at         TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- CONVERSATIONS
CREATE TABLE conversations (
    id              BIGSERIAL PRIMARY KEY,
    participant_a   BIGINT  NOT NULL REFERENCES users(id),
    participant_b   BIGINT  NOT NULL REFERENCES users(id),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- MESSAGES
CREATE TABLE messages (
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT  NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       BIGINT  NOT NULL REFERENCES users(id),
    content         TEXT    NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    message     TEXT         NOT NULL,
    type        VARCHAR(50),
    is_read     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- RATINGS
CREATE TABLE ratings (
    id              BIGSERIAL PRIMARY KEY,
    reviewer_id     BIGINT  NOT NULL REFERENCES users(id),
    target_id       BIGINT  NOT NULL REFERENCES users(id),
    reference_id    BIGINT  NOT NULL,
    reference_type  VARCHAR(20) NOT NULL,
    score           SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
    review_text     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- VIOLATION LOGS
CREATE TABLE violation_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT  REFERENCES users(id) ON DELETE SET NULL,
    user_email  VARCHAR(150),
    type        VARCHAR(100) NOT NULL,
    severity    VARCHAR(20)  NOT NULL,
    resolution  VARCHAR(200),
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_books_owner ON books(owner_id);
CREATE INDEX idx_books_status ON books(status);
CREATE INDEX idx_books_type ON books(transaction_type);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);
CREATE INDEX idx_transactions_seller ON transactions(seller_id);
CREATE INDEX idx_exchanges_initiator ON exchanges(initiator_id);
CREATE INDEX idx_exchanges_receiver ON exchanges(receiver_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_ratings_target ON ratings(target_id);
