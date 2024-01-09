import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../services/models/get-me-data';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private jwtHelper: JwtHelperService, 
    private router: Router, 
    private toastr: ToastrService,
    private cookieService: CookieService
  ) {

  }

  userData!: UserData;

  getMeUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/users';

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
              this.toastr.error("Only admins have an access to the admin dashboard");
              this.router.navigateByUrl("/dashboard");
            }
          }
          localStorage.setItem('userId', this.userData.id?.toString())
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
