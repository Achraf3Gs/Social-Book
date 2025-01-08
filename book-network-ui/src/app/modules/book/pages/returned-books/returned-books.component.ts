import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PageResponseBorrowedBookResponse} from '../../../../services/models/page-response-borrowed-book-response';
import {FeedBackRequest} from '../../../../services/models/feed-back-request';
import {BookService} from '../../../../services/services/book.service';
import {FeedBackService} from '../../../../services/services/feed-back.service';
import {BorrowedBookResponse} from '../../../../services/models/borrowed-book-response';
import {approveReturnBorrowedBook} from '../../../../services/fn/book/approve-return-borrowed-book';

@Component({
  selector: 'app-returned-books',
  standalone: true,
    imports: [
        NgForOf,
        NgIf
    ],
  templateUrl: './returned-books.component.html',
  styleUrl: './returned-books.component.scss'
})
export class ReturnedBooksComponent  implements OnInit{

  returnedBooks: PageResponseBorrowedBookResponse={};

  page=0;
  size=5;

  bookService=inject(BookService);
  message='';
  level='success';





  ngOnInit(): void {
    this.findAllReturnedBooks();
  }

  private findAllReturnedBooks() {
    this.bookService.findAllReturnedBooks({
      page: this.page,
      size: this.size,
    }).subscribe({
      next:(res)=>{
        this.returnedBooks=res;

      }
    })
  }

  goToFirstPage() {
    this.page=0;
    this.findAllReturnedBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllReturnedBooks();
  }

  goToPage(page: number) {
    this.page=page;
    this.findAllReturnedBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllReturnedBooks();
  }

  goToLastPage() {
    this.page=this.returnedBooks.totalPages as number -1;
    this.findAllReturnedBooks();
  }

  isLastPage() {
    return this.page == this.returnedBooks.totalPages as number -1;
  }




  approveBookReturn(book: BorrowedBookResponse) {
    if(!book.returned){
      this.level='error';
      this.message='The book is not yet returned';
      return;
    }
    this.bookService.approveReturnBorrowedBook({
      'book-id':book.id as number
    }).subscribe({
      next:()=>{
       this.level='success';
       this.message='Book return approved';
       this.findAllReturnedBooks();
      }
    })
  }
}
