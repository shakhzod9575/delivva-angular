import { Component, ViewChild } from '@angular/core';
import { Order } from '../services/models/order';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DisputeDataList } from '../services/models/dispute-list';
import { DisputeData } from '../services/models/dispute';
import { AuthService } from '../services/auth/auth.service';
import { UserData } from '../services/models/get-me-data';
import { Dispute } from '../services/models/dispute-data';

@Component({
  selector: 'app-dispute-list',
  templateUrl: './dispute-list.component.html',
  styleUrls: ['./dispute-list.component.css']
})
export class DisputeListComponent {

  displayedColumns: string[] = ["#", "Description", "Creator", "Dispute Type", "Status", "Action"];
  datasource: any;
  getDisputeListUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/disputes/all';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  currentPage: number = 0;
  pageSize: number = 5;
  currentUserData!: UserData;
  disputeFullData!: DisputeDataList;

  constructor(
    private http: HttpClient,
    private router: Router,
    private matRef: MatDialog,
    private authService: AuthService
  ) {
    this.http.get<DisputeDataList>(this.getDisputeListUrl + `?page=${this.currentPage}&size=${this.pageSize}`).subscribe({
      next: (data: DisputeDataList) => {
        console.log(data);
        const dataSource = data.data || [];
        this.disputeFullData = data;
        this.datasource = new MatTableDataSource<DisputeData>(dataSource);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      }
    })
  }

  handlePagination(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.http.get<DisputeDataList>(this.getDisputeListUrl + `?page=${this.currentPage}&size=${this.pageSize}`).subscribe({
      next: (data: DisputeDataList) => {
        console.log(data);
        const dataSource = data.data || [];
        this.datasource = new MatTableDataSource<DisputeData>(dataSource);
      }
    })
  }

  seeMore(element: Dispute) {
    if (element.orderId != undefined) {
      localStorage.setItem('orderId', element.orderId.toString());
      this.router.navigateByUrl("/dispute/data");
    }
  }
}
