package com.guesmish.book_network.book;

import com.guesmish.book_network.common.BaseEntity;
import com.guesmish.book_network.feedBack.FeedBack;
import com.guesmish.book_network.history.BookTransactionHistory;
import com.guesmish.book_network.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;


@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Book extends BaseEntity {


    private String title;
    private String authorName;
    private String isbn;
    private String synopsis;
    private String bookCover;
    private boolean archived;
    private boolean shareable;

    @ManyToOne()
    @JoinColumn(name="owner_id")
    private User owner;

    @OneToMany(mappedBy="book")
    private List<FeedBack> feedBacks;

    @OneToMany(mappedBy = "book")
    private List<BookTransactionHistory> histories;

    @Transient
    public double getRate(){
        if(feedBacks == null || feedBacks.isEmpty()){
            return 0.0;
        }
        var rate= this.feedBacks.stream()
                .mapToDouble(FeedBack::getNote)
                .average()
                .orElse(0.0);
        return Math.round(rate * 10.0) / 10.0;
    }

}
