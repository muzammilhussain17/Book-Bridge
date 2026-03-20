package com.bookbridges.repository;

import com.bookbridges.domain.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

        @Query("SELECT b FROM Book b WHERE b.status = 'ACTIVE' AND " +
                        "(:type IS NULL OR b.transactionType = :type) AND " +
                        "(:condition IS NULL OR b.condition = :condition) AND " +
                        "(cast(:category as string) IS NULL OR LOWER(b.category) = LOWER(cast(:category as string))) AND "
                        +
                        "(cast(:search as string) IS NULL OR (" +
                        "   LOWER(b.title) LIKE LOWER(CONCAT('%',cast(:search as string),'%')) OR " +
                        "   LOWER(b.author) LIKE LOWER(CONCAT('%',cast(:search as string),'%')) OR " +
                        "   LOWER(b.isbn) LIKE LOWER(CONCAT('%',cast(:search as string),'%'))" +
                        "))")
        Page<Book> findPublicBooks(@Param("type") Book.TransactionType type,
                        @Param("condition") Book.Condition condition,
                        @Param("category") String category,
                        @Param("search") String search,
                        Pageable pageable);

        List<Book> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

        List<Book> findByOwnerIdAndStatusOrderByCreatedAtDesc(Long ownerId, Book.BookStatus status);

        Page<Book> findByStatusOrderByCreatedAtDesc(Book.BookStatus status, Pageable pageable);

        long countByStatus(Book.BookStatus status);

        /** For AI context: search active books by keyword */
        @Query("SELECT b FROM Book b WHERE b.status = 'ACTIVE' AND (" +
                        "   LOWER(b.title) LIKE LOWER(CONCAT('%',cast(:keyword as string),'%')) OR " +
                        "   LOWER(b.author) LIKE LOWER(CONCAT('%',cast(:keyword as string),'%')) OR " +
                        "   LOWER(b.category) LIKE LOWER(CONCAT('%',cast(:keyword as string),'%')) OR " +
                        "   LOWER(b.isbn) LIKE LOWER(CONCAT('%',cast(:keyword as string),'%'))" +
                        ")")
        List<Book> searchActiveBooks(@Param("keyword") String keyword, Pageable pageable);

        /** Recent listings for AI context */
        @Query("SELECT b FROM Book b WHERE b.status = 'ACTIVE' ORDER BY b.createdAt DESC")
        List<Book> findRecentActiveBooks(Pageable pageable);
}
