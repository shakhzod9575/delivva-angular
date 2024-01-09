import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient
  ) { 
    
  }

  private oauthLoginUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/auth/login-oauth';
  private loginUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/auth/login';

  loginViaCredentials(loginData: any) {
    return this.http.post<any>(this.loginUrl, loginData);
  }

  loginViaOauth(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(this.oauthLoginUrl, {params: params});
  }
}
