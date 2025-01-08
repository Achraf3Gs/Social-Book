import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BookResponse} from '../../../../services/models/book-response';
import {NgIf} from '@angular/common';
import {RatingComponent} from '../rating/rating.component';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [RatingComponent,NgIf],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {

  @Input() _book!: BookResponse;
  @Input() _manage=false;
  private _bookCover:string | undefined;

  @Output() share:EventEmitter<BookResponse>= new EventEmitter<BookResponse>();
  @Output() archive:EventEmitter<BookResponse>= new EventEmitter<BookResponse>();
  @Output() addToWaitingList:EventEmitter<BookResponse>= new EventEmitter<BookResponse>();
  @Output() borrow:EventEmitter<BookResponse>= new EventEmitter<BookResponse>();
  @Output() edit:EventEmitter<BookResponse>= new EventEmitter<BookResponse>();
  @Output() details:EventEmitter<BookResponse>= new EventEmitter<BookResponse>();

  get bookCover(): string | undefined {
    if(this._book.cover){
      return 'data:image/png;base64, ' + this._book.cover;
    }
    return "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fec45e055-8d7d-467d-a3de-ec192d4e9df2_1200x920.jpeg";
  }

  onShowDetails() {
  this.details.emit(this._book);
  }

  onBorrow() {
    this.borrow.emit(this._book);
  }

  onAddToWaitingList() {
    this.addToWaitingList.emit(this._book);
  }

  onEdit() {
    this.edit.emit(this._book);
  }

  onShare() {
    this.share.emit(this._book);
  }

  onArchive() {
    this.archive.emit(this._book);
  }
}
