import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationData } from '../models/registration-data-model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private registrationUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/register';

  constructor(private http: HttpClient) { }

  createUser(registrationDto: RegistrationData) {
    return this.http.post<any>(this.registrationUrl, registrationDto);
  }
}
