import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../services/models/get-me-data';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  productSales!: any[];
  view: [number, number] = [1000, 450];
  tooltip = true;

  // options
  legendTitle: string = 'Usage Types';
  legendTitleMulti: string = 'Months';
  legendPosition: LegendPosition = LegendPosition.Right; // ['right', 'below']
  legend: boolean = true;

  xAxis: boolean = true;
  yAxis: boolean = true;

  yAxisLabel: string = 'Quantity';
  xAxisLabel: string = 'Usage';
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;

  maxXAxisTickLength: number = 30;
  maxYAxisTickLength: number = 30;
  trimXAxisTicks: boolean = false;
  trimYAxisTicks: boolean = false;
  rotateXAxisTicks: boolean = false;

  xAxisTicks: any[] = ['Genre 1', 'Genre 2', 'Genre 3', 'Genre 4', 'Genre 5', 'Genre 6', 'Genre 7']
  yAxisTicks: any[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150]

  animations: boolean = true; // animations on load

  showGridLines: boolean = true; // grid lines

  showDataLabel: boolean = true; // numbers on bars

  showLegend: boolean = true;
  showLabels: boolean = true;

  gradient: boolean = false;
  colorScheme: Color = {name: 'test', selectable: true, group: ScaleType.Ordinal, domain: ['#704FC4', '#4B852C', '#B67A3D', '#5B6FC8', '#25706F']};
  schemeType: ScaleType = ScaleType.Ordinal; // 'ordinal' or 'linear'

  activeEntries: any[] = ['book']
  barPadding: number = 20
  tooltipDisabled: boolean = false;

  yScaleMax: number = 9000;

  roundEdges: boolean = false;

  // formatString(input: string): string {
  //   return input.toUpperCase()
  // }

  formatNumber(input: number): number {
    return input
  }

  adminDiagramUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/admin-diagram';

  constructor(
    private http: HttpClient, 
    private jwtHelper: JwtHelperService, 
    private router: Router, 
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {
    
  }

  userData!: UserData;

  getMeUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/users';

  ngOnInit(): void {
    this.http.get<UserData>(this.getMeUrl).subscribe({
      next: (data: UserData) => {
        this.userData = data;
        if (this.userData.id != undefined) {
          const token = localStorage.getItem('token');
          if (token != null) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            const role = decodedToken['authorities'][0]['authority'];
            if(role === 'ROLE_USER') {
              this.router.navigateByUrl("/dashboard");
            }
          }
          this.http.get(this.adminDiagramUrl).subscribe({
            next: (data: any) => {
              this.productSales = data;
            }
          });
          localStorage.setItem('userId', this.userData.id?.toString());
        }
      },
      error: (error: any) => {
        this.router.navigateByUrl('/');
        this.toastr.error("Please login to continue!!!");
      }
    })
  }

  logout() {
    this.cookieService.delete('token');
    localStorage.clear();
    this.router.navigateByUrl('/');
  }
}
