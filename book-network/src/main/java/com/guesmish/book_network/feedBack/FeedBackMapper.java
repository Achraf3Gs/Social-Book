package com.guesmish.book_network.feedBack;

import com.guesmish.book_network.book.Book;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class FeedBackMapper {
    public FeedBack toFeedBack(FeedBackRequest feedBackRequest) {
        return FeedBack.builder()
                .note(feedBackRequest.note())
                .comment(feedBackRequest.comment())
                .book(Book.builder()
                        .id(feedBackRequest.bookId())
                        .archived(false)
                        .shareable(false)
                        .build()
                )
                .build();

    }

    public FeedBackResponse toFeedBackResponse(FeedBack f, Integer userId) {

        return FeedBackResponse.builder()
                .note(f.getNote())
                .comment(f.getComment())
                .ownFeedBack(Objects.equals(f.getCreatedBy(),userId))
                .build();
    }
}
