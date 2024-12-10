package com.guesmish.book_network.feedBack;

import com.guesmish.book_network.book.Book;
import com.guesmish.book_network.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class FeedBack  extends BaseEntity {


    private Double note;//1-5 stars
    private String comment;

    @ManyToOne
    @JoinColumn(name= "book_id")
    private Book book;

}
