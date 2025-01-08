import {Component, inject, OnInit} from '@angular/core';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';
import {NgFor, NgIf} from '@angular/common';
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {BookService, FeedBackService} from '../../../../services/services';
import {FeedBackRequest} from '../../../../services/models/feed-back-request';
import {FormsModule} from '@angular/forms';
import {RatingComponent} from '../../components/rating/rating.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-borrowed-book-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RatingComponent, RouterLink],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss'
})
export class BorrowedBookListComponent implements OnInit {
  borrowedBooks: PageResponseBorrowedBookResponse={};
  feedBackRequest:FeedBackRequest={bookId: 0, comment: "", note:0};
  page=0;
  size=5;

  bookService=inject(BookService);
  private feedBackService=inject(FeedBackService);
  selectedBook: BorrowedBookResponse | undefined= undefined;

  returnedBorrowedBook(book: BorrowedBookResponse) {
   this.selectedBook= book;
   this.feedBackRequest.bookId=book.id as number;
  }

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }

  private findAllBorrowedBooks() {
    this.bookService.findAllBorrowedBooks({
      page: this.page,
      size: this.size,
    }).subscribe({
      next:(res)=>{
        this.borrowedBooks=res;
      }
    })
  }

  goToFirstPage() {
    this.page=0;
    this.findAllBorrowedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }

  goToPage(page: number) {
    this.page=page;
    this.findAllBorrowedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }

  goToLastPage() {
    this.page=this.borrowedBooks.totalPages as number -1;
    this.findAllBorrowedBooks();
  }

  isLastPage() {
    return this.page == this.borrowedBooks.totalPages as number -1;
  }

  returnBook(withFeedBack: boolean) {
   this.bookService.returnBorrowedBook({
     'book-id': this.selectedBook?.id as number
   }).subscribe({
     next:()=>{
       if(withFeedBack){
         this.giveFeedBack();
       }
       this.selectedBook=undefined;
       this.findAllBorrowedBooks()
     }
   });
  }

  private giveFeedBack() {
    this.feedBackService.saveFeedback({
      body: this.feedBackRequest
    }).subscribe({
      next:()=>{}
    });
  }
}
