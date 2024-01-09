import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileData } from '../models/profile-data-model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { }

  baseUrl: string = "http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/users/fill-profile";
  basePhotoUrl: string = "http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/users/picture/";

  saveUserProfile(data: ProfileData) {
    return this.httpClient.post<String>(this.baseUrl, data);
  }

  savePhoto(file: File) {
    const userId = localStorage.getItem('userId');
    const formData = new FormData();
    formData.append('image', file);
    this.httpClient.post(this.basePhotoUrl+userId, formData, {responseType: 'text'})
    .subscribe({
      next: (photoUrl) => {
        localStorage.setItem('photoLink', photoUrl.toString());
        console.log("Photo is successfully uploaded");
      },
      error: (error) => {
        console.log(error);
        this.toastr.error("Something went wrong while saving the photo");
      }
    });
  }
}
