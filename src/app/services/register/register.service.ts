import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationData } from '../models/registration-data-model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private registrationUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/auth/register';

  constructor(private http: HttpClient) { }

  createUser(registrationDto: RegistrationData) {
    return this.http.post<any>(this.registrationUrl, registrationDto);
  }
}
