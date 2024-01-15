import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-c2',
  templateUrl: './order-c2.component.html',
  styleUrls: ['./order-c2.component.css']
})
export class OrderC2Component implements OnInit {

  isDateProvided: boolean = false;
  isDateValid: boolean = false;
  makeClickable: boolean = false;
  isItemDescProvided: boolean = false;
  dateForm: FormGroup;
  description: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private toastr: ToastrService, private http: HttpClient) {
    this.dateForm = this.fb.group({
      date: [null, [Validators.required]]
    });
    this.description = this.fb.group({
      description: ['', [Validators.required]]
    });
  }
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  errorMessage!: string;
  stringDate!: string;

  dateChanged(event: any) {
    const inputDate = this.dateForm.value.date;
    const currentDate = new Date();
    if(inputDate != null && inputDate <= currentDate) {
      this.isDateValid = false;
      this.errorMessage = "Cannot choose the past date";
    } else {
      this.isDateValid = true;
      this.errorMessage = "";
      const year = inputDate.getFullYear();
      const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
      const day = ('0' + inputDate.getDate()).slice(-2);
      const date = `${year}-${month}-${day}`;
      this.stringDate = date;
    }
    this.isDateProvided = !this.dateForm.get('date')?.hasError('required') && this.isDateValid;
  }

  validateDescription() {
    this.isItemDescProvided = !this.description.get('description')?.hasError('required');
  }

  validateAll() {
    return this.makeClickable = this.isItemDescProvided && this.isDateProvided;
  }

  addOrderUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders';

  onSubmit() {
    const lonFrom = localStorage.getItem('lonFrom');
    const latFrom = localStorage.getItem('latFrom');
    const lonTo = localStorage.getItem('lonTo');
    const latTo = localStorage.getItem('latTo');
    const userId = localStorage.getItem('userId');
    const orderData = {
      userId: Number(userId),
      itemDescription: this.description.value.description,
      startingDestination: {
        longitude: Number(lonFrom),
        latitude: Number(latFrom)
      },
      finalDestination: {
        longitude: Number(lonTo),
        latitude: Number(latTo)
      },
      scheduledDeliveryDate: this.stringDate
    };
    console.log(orderData);
    this.http.post<any>(this.addOrderUrl, orderData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigateByUrl("/dashboard");
        this.toastr.success("Order is successfully created!!");
      }
    })
  }
}
