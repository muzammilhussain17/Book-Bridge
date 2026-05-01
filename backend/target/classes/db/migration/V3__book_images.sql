CREATE TABLE book_images (
    book_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);
