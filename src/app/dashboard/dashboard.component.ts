import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../services/models/get-me-data';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { DiagramDataSelect } from '../services/models/diagram-data-select';
import { InProgressOrder } from '../services/models/InProgressOrder';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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

  userDiagramUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/user-diagram';

  constructor(
    private http: HttpClient, 
    private jwtHelper: JwtHelperService, 
    private toastr: ToastrService, 
    private router: Router,
    private cookieService: CookieService,
    private oauthService: SocialAuthService
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
            if(role === 'ROLE_ADMIN') {
              this.router.navigateByUrl("/dashboard/admin");
            }
          }
          this.http.get(this.userDiagramUrl + `?userId=${this.userData.id}`).subscribe({
            next: (data: any) => {
              this.productSales = data;
            }
          })
          localStorage.setItem('userId', this.userData.id?.toString());
        }
      },
      error: (error: any) => {
        console.log(error.error.message);
      }
    })
  }

  logout() {
    this.cookieService.delete('token');
    localStorage.clear(); 
    this.router.navigateByUrl('/');
    this.oauthService.signOut();
  }

  select(data:DiagramDataSelect) {
    if(data.name === 'Active Orders') {
      this.router.navigateByUrl('/my-orders/list');
    } else if(data.name === 'Active Deliveries') {
      this.router.navigateByUrl('/my-delivery/list');
    } else if(data.name === 'History(Orders)') {
      this.router.navigateByUrl('/my-orders/history');
    } else {
      this.router.navigateByUrl('/my-delivery/history');
    }
  }

  deleteAccountUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/users';
  checkOrderUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/user-has-started-orders';

  deleteAccount() {
    const userId = localStorage.getItem('userId');
    this.http.get<InProgressOrder>(this.checkOrderUrl + `?userId=${userId}`).subscribe({
      next: (checkData: InProgressOrder) => {
        if(checkData.hasActiveOrders === true) {
          this.toastr.error("You cannot delete your account untill you finish all active orders and deliveries");
        } else {
          this.http.delete(this.deleteAccountUrl + `?userId=${userId}`).subscribe({
            next: () => {
              this.toastr.success("Account is successfully deleted!!!");
              localStorage.clear();
              this.router.navigateByUrl('/home');
            }
          })
        }
      }
    })
  }
}
