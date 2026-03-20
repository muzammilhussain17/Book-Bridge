package com.bookbridges.repository;

import com.bookbridges.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

       Optional<User> findByEmail(String email);

       boolean existsByEmail(String email);

       long countByStatus(User.UserStatus status);

       /**
        * Fixed JPQL: the OR clause for email is now correctly wrapped inside the
        * :search IS NULL guard.
        * Previous version had: (:search IS NULL OR name LIKE...) OR email LIKE...
        * Which made the email LIKE bypass the :search IS NULL check entirely.
        */
       @Query("SELECT u FROM User u WHERE " +
                     "(:role IS NULL OR u.role = :role) AND " +
                     "(cast(:search as string) IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', cast(:search as string), '%')) "
                     +
                     "    OR LOWER(u.email) LIKE LOWER(CONCAT('%', cast(:search as string), '%')))")
       Page<User> findByFilters(@Param("role") User.Role role,
                     @Param("search") String search,
                     Pageable pageable);
}
