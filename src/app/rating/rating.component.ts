import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  constructor(
    private dialogRef: MatDialogRef<RatingComponent>,
    private toastr: ToastrService,
    private http: HttpClient,
    private router: Router
  )
  {}
  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();

  setRating(rating: number): void {
    this.rating = rating;
    this.ratingChange.emit(rating);
  }

  cancel() {
    this.dialogRef.close();
  }

  ratingUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/evaluations';

  onSubmit() {
    const orderId = Number(localStorage.getItem('orderId'));
    const userId = Number(localStorage.getItem('userId'));
    const ratingData = {
      orderId: orderId,
      userId: userId,
      rate: this.rating
    };
    this.http.post(this.ratingUrl, ratingData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.toastr.success("Thank you for your submittion!!!");
        this.dialogRef.close();
      }, 
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    });
  }

}
