import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from '../services/models/get-me-data';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private http: HttpClient, 
    private jwtHelper: JwtHelperService, 
    private toastr: ToastrService, 
    private router: Router,
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
            if(role === 'ROLE_ADMIN') {
              this.toastr.error("Only users have an access to the user dashboard");
              this.router.navigateByUrl("/dashboard/admin");
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
