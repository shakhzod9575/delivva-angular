import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {

  selectedRating!: number;
  rating: FormGroup;

  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private matRef: MatDialogRef<RatingComponent>,
    private fb: FormBuilder
  ) {
    this.rating = this.fb.group({
      rating: ['', Validators.required],
    });
  }

  onSubmit() {
    this.toastr.success("Thank you for your submittion");
    console.log(this.rating.value.rating);
    this.matRef.close();
  }

  onCancel() {
    this.matRef.close();
  }

}
