import {Component, inject, OnInit} from '@angular/core';
import {BookCardComponent} from "../../components/book-card/book-card.component";
import {NgForOf, NgIf} from "@angular/common";
import {PageResponseBookResponse} from '../../../../services/models/page-response-book-response';
import {BookService} from '../../../../services/services/book.service';
import {Router, RouterLink} from '@angular/router';
import {BookResponse} from '../../../../services/models/book-response';

@Component({
  selector: 'app-my-books',
  standalone: true,
    imports: [
        BookCardComponent,
        NgForOf,
        NgIf,
        RouterLink
    ],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss'
})
export class MyBooksComponent implements OnInit{

  bookResponse: PageResponseBookResponse = {
    content: [], // Initialize content as an empty array
    first: false,
    last: false,
    number: 0,
    size: 3,
    totalElements: 0,
    totalPages: 0
  };
  page=0;
  size=3;

  bookService=inject(BookService);
  router=inject(Router);



  ngOnInit(): void {
    this.findAllBooks();
  }


  private findAllBooks() {
    this.bookService.findAllBooksByOwner({
      size:this.size,
      page:this.page
    }).subscribe({
      next:(books)=>{
        this.bookResponse=books;
      }
    });
  }


  goToFirstPage() {
    this.page=0;
    this.findAllBooks();
  }

  goToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }

  goToPage(page: number) {
    this.page=page;
    this.findAllBooks();
  }

  goToNextPage() {
    this.page++;
    this.findAllBooks();
  }

  goToLastPage() {
    this.page=this.bookResponse.totalPages as number -1;
    this.findAllBooks();
  }

  isLastPage() {
    return this.page == this.bookResponse.totalPages as number -1;
  }


  archiveBook(book: BookResponse) {
    this.bookService.updateArchiveStatus({
      'book-id': book.id as number
    }).subscribe({
      next:()=>{
        book.archive= !book.archive;
      }
    });
  }

  shareBook(book: BookResponse) {
this.bookService.updateShareableStatus({
  'book-id': book.id as number
}).subscribe({
  next:()=>{
    book.shareable= !book.shareable;
  }
});
  }

  editBook(book: BookResponse) {
    this.router.navigate(['books','manage',book.id])
  }
}
