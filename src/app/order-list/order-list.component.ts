import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from '../services/models/order';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CarData } from '../services/models/car';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit{

  orders!: Order[];
  displayedColumns: string[] = ["#", "Description", "Creator", "Delivery Date", "Action"];
  datasource: any;
  getOrderListUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/orders/get-active-orders';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userRole!: string;
  currentPage!: number;
  pageSize!: number;
  private getCarUrl = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/vehicles';
  myCar!: CarData;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.userRole = localStorage.getItem('role') || "";
    this.http.get<Order[]>(this.getOrderListUrl).subscribe({
      next: (data: any) => {
        this.orders = data;
        console.log(this.orders);
        this.datasource = new MatTableDataSource<Order>(this.orders);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      }
    })
  }
  ngOnInit(): void {
    const params = new HttpParams().set("userId", Number(localStorage.getItem('userId')));
    this.http.get<CarData>(this.getCarUrl, { params: params }).subscribe({
      next: (data: CarData) => {
        this.myCar = data;
      }
    })
  }

  seeMore(element: Order) {
    if (element.id != undefined) {
      localStorage.setItem('orderId', element.id.toString());
      this.router.navigateByUrl("/orders/data");
    }
  }

  inviteUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/orders/offer-by-courier';

  offerTheDelivery(order: Order) {
    const courierId = Number(localStorage.getItem('userId'));
    const orderId = order.id;
    const orderInviteDTO = {
      userId: courierId,
      orderId: orderId
    };

    this.http.post(this.inviteUrl, orderInviteDTO).subscribe({
      next: () => {
        this.toastr.success("Invitation is successfully sent!!!");
      }
    })
  }

  checkOfferAble() {
    return this.userRole === 'ROLE_USER' && this.myCar;
  }
}
