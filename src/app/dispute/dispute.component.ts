import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DisputeData } from '../services/models/dispute';
import { HttpClient } from '@angular/common/http';
import { Dispute } from '../services/models/dispute-data';
import { UserData } from '../services/models/get-me-data';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth/auth.service';
import { SingleDisputeData } from '../services/models/single-dispute';
import { error } from 'geotiff/dist-node/logging';
import { OrderService } from '../services/order/order.service';
import { Order } from '../services/models/order';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.css']
})
export class DisputeComponent {

  disputeTypes!: DisputeData[];
  disputeUser!: UserData;
  selectedDisputeType!: DisputeData;
  catchDisputeType!: DisputeData;
  enteredDescription!: string;
  dispute!: SingleDisputeData;

  disputeTypeUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/disputes/types';
  disputeDataUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/disputes'

  commentForm!: FormGroup;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) {
    const orderId = Number(localStorage.getItem('orderId'));
    this.http.get<SingleDisputeData>(this.disputeDataUrl + `/${orderId}`).subscribe({
      next: (data: SingleDisputeData) => {
        console.log(data);
        this.dispute = data;
        const userId = this.dispute.userId;
        if (userId != undefined) {
          this.authService.getUserById(userId).subscribe({
            next: (userData: UserData) => this.disputeUser = userData
          });
        }
      },
      error: (error: any) => {
        console.log(error.error.message);
      }
    })
  }

  ngOnInit() {
    const orderId = Number(localStorage.getItem('orderId'));
    this.http.get<DisputeData[]>(this.disputeTypeUrl).subscribe({
      next: (data: any) => {
        console.log(data);
        this.disputeTypes = data;
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    });
  }

  onDisputeTypeChange() {
    console.log(this.disputeTypes);
    console.log(this.selectedDisputeType);
    console.log(this.enteredDescription);
  }

  validateInputs() {
    return !!this.selectedDisputeType && !!this.enteredDescription;
  }

  onSubmit() {
    const dispute = {
      orderId: Number(localStorage.getItem('orderId')),
      disputeTypeId: this.selectedDisputeType.id,
      userId: Number(localStorage.getItem('userId')),
      description: this.enteredDescription
    };
    console.log(dispute);
    this.http.post<any>(this.disputeDataUrl, dispute).subscribe({
      next: (data: any) => {
        window.location.reload();
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    })
  }

  closeTheDispute() {
    const closeDisputeUrl = this.disputeDataUrl + `/close/${this.dispute.id}`;
    this.http.put(closeDisputeUrl, null).subscribe({
      next: () => {
        window.location.reload();
      }
    })
  }
}
