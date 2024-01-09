import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SingleDisputeData } from '../services/models/single-dispute';
import { AuthService } from '../services/auth/auth.service';
import { UserData } from '../services/models/get-me-data';
import { Order } from '../services/models/order';
import { OrderService } from '../services/order/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dispute-data',
  templateUrl: './dispute-data.component.html',
  styleUrls: ['./dispute-data.component.css']
})
export class DisputeDataComponent {

  dispute!: SingleDisputeData;
  disputeCreator!: UserData;
  order!: Order;

  getDisputeByOrderIdUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/disputes/';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
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

  startAnalyzing() {
    
  }

}
