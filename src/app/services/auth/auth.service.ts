import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../models/get-me-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private confirmEmailUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/auth/confirm-email';
  private getUserByIdUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/users';

  constructor(private http: HttpClient) { }

  confirmEmail(token: string) {
    let params = new HttpParams().set('token', token);
    return this.http.get(this.confirmEmailUrl, {params: params});
  }

  getUserById(userId: number) {
    return this.http.get<UserData>(this.getUserByIdUrl + `/${userId}`);
  }
}
