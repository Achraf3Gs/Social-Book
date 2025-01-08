import {Component, inject, OnInit} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BookRequest} from '../../../../services/models/book-request';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BookService} from '../../../../services/services/book.service';



@Component({
  selector: 'app-manage-book',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss'
})
export class ManageBookComponent implements OnInit{

  bookRequest: BookRequest = {
    authorName: '',
    isbn: '',
    synopsis: '',
    title: ''
  };
  errMsg:Array<string>=[];
  selectedBookCover:any;
  stdimg="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fec45e055-8d7d-467d-a3de-ec192d4e9df2_1200x920.jpeg"
  selectedPicture: string|undefined;

  ngOnInit(): void {
    const bookId = this.activatedRoute.snapshot.params['bookId'];
    if (bookId) {
      this.bookService.findBookById({
        'book-id': bookId
      }).subscribe({
        next: (book) => {
          this.bookRequest = {
            id: book.id,
            title: book.title as string,
            authorName: book.authorName as string,
            isbn: book.isbn as string,
            synopsis: book.synopsis as string,
            shareable: book.shareable
          }
          if(book.cover){
            this.selectedPicture='data:image/jpg;base64,' + book.cover;
          }
        }
      });
    }
  }


  bookService=inject(BookService);
  router=inject(Router);
  activatedRoute=inject(ActivatedRoute);

  onFileSelected(event:any) {
   this.selectedBookCover= event.target.files[0];
   console.log(this.selectedBookCover);
   if(this.selectedBookCover){
     const reader=new FileReader();
     reader.onload=()=>{
       this.selectedPicture=reader.result as string;
     }
     reader.readAsDataURL(this.selectedBookCover);
   }
  }

  saveBook() {
    console.log('BookRequest payload:', this.bookRequest);

    // Save the book details
    this.bookService.saveBook({
      body: this.bookRequest
    }).subscribe({
      next: (bookId) => {
        console.log('Book saved with ID:', bookId);

        // Upload the book cover only if a new file is selected
        if (this.selectedBookCover) {
          console.log('Uploading book cover:', this.selectedBookCover);
          this.bookService.uploadBookCoverPicture({
            'book-id': bookId,
            body: {
              file: this.selectedBookCover
            }
          }).subscribe({
            next: () => {
              console.log('File uploaded successfully');
              this.router.navigate(['/books/my-books']);
            },
            error: (err) => {
              console.error('Error uploading file:', err);
            }
          });
        } else {
          console.log('No new file selected for upload');
          // Navigate directly if no new file is selected
          this.router.navigate(['/books/my-books']);
        }
      },
      error: (err) => {
        this.errMsg = err.error.validationErrors;
        console.error('Error saving book:', err);
      }
    });
  }




}
