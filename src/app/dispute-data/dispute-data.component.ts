import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleDisputeData } from '../services/models/single-dispute';
import { AuthService } from '../services/auth/auth.service';
import { UserData } from '../services/models/get-me-data';
import { Order } from '../services/models/order';
import { OrderService } from '../services/order/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dispute-data',
  templateUrl: './dispute-data.component.html',
  styleUrls: ['./dispute-data.component.css']
})
export class DisputeDataComponent {

  dispute!: SingleDisputeData;
  disputeCreator!: UserData;
  order!: Order;

  getDisputeByOrderIdUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/disputes/';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService
  ) {
    const orderId = Number(localStorage.getItem('orderId'));
    this.http.get(this.getDisputeByOrderIdUrl + orderId).subscribe({
      next: (data: SingleDisputeData) => {
        console.log(data);
        this.dispute = data;
        const userId = data.userId;
        if (userId !== undefined) {
          this.authService.getUserById(userId).subscribe({
            next: (userData: UserData) => this.disputeCreator = userData
          });
        }
      }
    });
    this.orderService.getOrderById(orderId).subscribe({
      next: (orderData: Order) => this.order = orderData
    });
  }

  isCreatorCourier() {
    return this.disputeCreator.id === this.order.courier.id;
  }

  seeAnOrder() {
    const orderId = this.order.id;
    if (orderId !== undefined) {
      localStorage.setItem('orderId', orderId.toString());
      this.router.navigateByUrl("/orders/data/visualize");
    }
  }

  statusChangeUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/status'

  startAnalyzing() {
    const orderId = Number(localStorage.getItem('orderId'));
    const status = 'UNDER_CONSIDERATION';
    const statusChangeData = {
      id: orderId,
      status: status
    };
    this.http.put(this.statusChangeUrl, statusChangeData).subscribe({
      next: () => {
        window.location.reload();
      }
    })
  }

  disputeWinner(isCustomer: boolean) {
    const orderId = Number(localStorage.getItem('orderId'));
    const status = (isCustomer) ? 'DISPUTE_CLOSED_CUSTOMER_WIN' : 'DISPUTE_CLOSED_COURIER_WIN';
    const statusChangeData = {
      id: orderId,
      status: status
    };
    this.http.put(this.statusChangeUrl, statusChangeData).subscribe({
      next: () => {
        window.location.reload();
      }
    })
  };

}
