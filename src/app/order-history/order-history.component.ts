import { Component, ViewChild } from '@angular/core';
import { Order } from '../services/models/order';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {

  orders!: Order[];
  displayedColumns: string[] = ["#", "Description", "Creator", "Delivery Date", "Status", "Action"];
  datasource: any;
  getOrderListUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/orders/get-history-orders';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private router: Router,
    private matRef: MatDialog
  ) {
    const param = new HttpParams().set('customerId', Number(localStorage.getItem('userId')));
    this.http.get<Order[]>(this.getOrderListUrl, {params: param}).subscribe({
      next: (data: any) => {
        this.orders = data;
        console.log(this.orders);
        this.datasource = new MatTableDataSource<Order>(this.orders);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      }
    })
  }

  seeMore(element: Order) {
    if (element.id != undefined) {
      localStorage.setItem('orderId', element.id.toString());
      this.router.navigateByUrl("/my-orders/history/data");
    }
  }

}
