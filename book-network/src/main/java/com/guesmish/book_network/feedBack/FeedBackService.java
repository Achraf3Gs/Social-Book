package com.guesmish.book_network.feedBack;

import com.guesmish.book_network.book.Book;
import com.guesmish.book_network.book.BookRepository;
import com.guesmish.book_network.common.PageResponse;
import com.guesmish.book_network.exception.OperationNotPermittedException;
import com.guesmish.book_network.history.BookTransactionHistory;
import com.guesmish.book_network.user.User;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class FeedBackService {

    private final BookRepository bookRepository;
    private final FeedBackMapper feedBackMapper;
    private final FeedBackRepository feedBackRepository;

    public Integer save(FeedBackRequest feedBackRequest,
                        Authentication connectedUser) {
        Book book = bookRepository.findById(feedBackRequest.bookId()).orElseThrow(
                () -> new EntityNotFoundException("No book found with the ID:" + feedBackRequest.bookId()));

        if (book.isArchived() || !book.isShareable()) {
            throw new OperationNotPermittedException("You cannot give a feedBack for an archived or not shareable book");
        }

        User user = ((User) connectedUser.getPrincipal());
        if (Objects.equals(book.getOwner().getId(), user.getId())) {
            throw new OperationNotPermittedException("You cannot give a feedBack to your own book");
        }
        FeedBack feedBack= feedBackMapper.toFeedBack(feedBackRequest);
        return feedBackRepository.save(feedBack).getId();
    }

    public PageResponse<FeedBackResponse> findAllFeedBacksByBook(
            Integer bookId,
            int page,
            int size,
            Authentication connectedUser) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdDate"));
        User user = ((User) connectedUser.getPrincipal());
        Page<FeedBack> feedBacks = feedBackRepository.findAllByBookId(bookId,pageable);
        List<FeedBackResponse> feedBackResponses = feedBacks.stream()
                .map(f ->  feedBackMapper.toFeedBackResponse(f, user.getId()))
                .toList();
        return new PageResponse<>(
                feedBackResponses,
                feedBacks.getNumber(),
                feedBacks.getSize(),
                feedBacks.getTotalElements(),
                feedBacks.getTotalPages(),
                feedBacks.isFirst(),
                feedBacks.isLast()
        );
    }
}



