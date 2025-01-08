import {Component, inject, OnInit} from '@angular/core';
import {BookService} from '../../../../services/services';
import {Router} from '@angular/router';
import {BookResponse, PageResponseBookResponse} from '../../../../services/models';
import {NgFor, NgIf} from '@angular/common';
import {BookCardComponent} from '../../components/book-card/book-card.component';


@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [NgFor, BookCardComponent,NgIf],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss'
})
export class BookListComponent implements OnInit{



  bookResponse: PageResponseBookResponse = {
    content: [], // Initialize content as an empty array
    first: false,
    last: false,
    number: 0,
    size:3,
    totalElements: 0,
    totalPages: 0
  };
  page=0;
  size=3;

  bookService=inject(BookService);
  router=inject(Router);
  message: string='';
  level='string';


  ngOnInit(): void {
    this.findAllBooks();
  }


  private findAllBooks() {
    this.bookService.findAllBooks({
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

  boroowBook(book: BookResponse) {
    this.message="";
    this.bookService.borrowBook({
      'book-id':book.id as number
    }).subscribe({
      next:()=>{
        this.level="success";
        this.message="Book successfully added to your list"
      },
      error:(err)=>{
        console.log(err);
        this.level='error';
        this.message=err.error.error;
      }
    });
  }
}
