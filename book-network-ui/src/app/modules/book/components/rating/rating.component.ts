import {Component, Input} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss'
})
export class RatingComponent {


  @Input() _rating = 0;
  maxRating: number = 5;

  get fullStars(): number {
    return Math.floor(this._rating);
  }

  get hasHalfStar() {
    return this._rating % 1 !== 0;
  }

  get emptyStars(): number {
    return this.maxRating - Math.ceil(this._rating);
  }

}

