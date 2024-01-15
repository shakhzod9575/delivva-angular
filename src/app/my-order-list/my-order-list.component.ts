import { Component, ViewChild } from '@angular/core';
import { Order } from '../services/models/order';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-my-order-list',
  templateUrl: './my-order-list.component.html',
  styleUrls: ['./my-order-list.component.css']
})
export class MyOrderListComponent {

  orders!: Order[];
  displayedColumns: string[] = ["#", "Description", "Creator", "Delivery Date", "Status", "Action"];
  datasource: any;
  getOrderListUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/get-active-orders';
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
      this.router.navigateByUrl("/my-orders/data");
    }
  }
}
