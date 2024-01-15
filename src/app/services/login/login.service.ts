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

  private oauthLoginUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/login-oauth';
  private loginUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/login';

  loginViaCredentials(loginData: any) {
    return this.http.post<any>(this.loginUrl, loginData);
  }

  loginViaOauth(email: string) {
    const params = new HttpParams().set('email', email);
    return this.http.get<any>(this.oauthLoginUrl, {params: params});
  }
}
