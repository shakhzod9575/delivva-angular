import { Component, Input } from '@angular/core';
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

  constructor(
    private toastr: ToastrService, 
    private router: Router,
    private matRef: MatDialogRef<RatingComponent>,
    private fb: FormBuilder
  ) {
  }

  @Input() rating!: number;
  get stars() {
    return Array(Math.floor(this.rating)).fill(0);
  }

}
