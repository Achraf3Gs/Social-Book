package com.guesmish.book_network.history;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface    BookTransactionHistoryRepository  extends JpaRepository<BookTransactionHistory, Integer> {

    @Query("""
              SELECT history
              FROM BookTransactionHistory history
              WHERE history.user.id= :userId
           """)
    Page<BookTransactionHistory> findAllBorrowedBooks(Pageable pageable, Integer userId);

    @Query("""
             SELECT history
             FROM BookTransactionHistory history
             WHERE history.book.createdBy = :userId
           """)
    Page<BookTransactionHistory> findAllReturnedBooks(Pageable pageable, String userId);


    @Query("""
              SELECT
              (COUNT(*) > 0) AS isBorrowed
              FROM BookTransactionHistory bookTransactionHistory
              WHERE bookTransactionHistory.user.id= :userId
              AND bookTransactionHistory.book.id= :bookId
              AND bookTransactionHistory.returnedApproved= false
          """)
    boolean isAlreadyBorrowedByUser(Integer bookId, Integer userId);

    @Query("""
              SELECT history
              FROM BookTransactionHistory history
              WHERE history.user.id= :userId
              AND history.book.id= :bookId
              AND history.returned= false
              AND history.returnedApproved= false
           """)
    Optional<BookTransactionHistory> findByBookIdAndUserId(@Param("bookId") Integer bookId, @Param("userId") String userId);


    @Query("""
              SELECT history
              FROM BookTransactionHistory history
              WHERE history.book.owner.id= :userId
              AND history.book.id= :bookId
              AND history.returned= true
              AND history.returnedApproved= false
           """)
    Optional<BookTransactionHistory> findByBookIdAndOwnerId(@Param("bookId") Integer bookId, @Param("userId") String userId);
}
