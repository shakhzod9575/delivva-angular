import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserData } from '../services/models/get-me-data';
import { CarData } from '../services/models/car';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.css']
})
export class ProfileDataComponent implements OnInit {

  private getCarUrl = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/vehicles'
  myCar!: CarData;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    const role = localStorage.getItem('role');
    if (role === 'ROLE_USER') {
      const params = new HttpParams().set("userId", Number(localStorage.getItem('userId')));
      this.http.get<CarData>(this.getCarUrl, { params: params }).subscribe({
        next: (data: CarData) => {
          this.myCar = data;
        }
      })
    }
  }

  getMeUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/users';

  userData!: UserData;

  selectedPhotoLink: string = 'https://static.vecteezy.com/system/resources/thumbnails/019/900/322/small/happy-young-cute-illustration-face-profile-png.png';

  ngOnInit(): void {
    this.http.get<UserData>(this.getMeUrl).subscribe({
      next: (data: UserData) => {
        this.userData = data;
        console.log(data);
        if (data.photoLink != null) {
          this.selectedPhotoLink = data.photoLink;
        }
      }
    })
  }

  deleteTheCar() {
    this.http.delete(this.getCarUrl + "/" + this.myCar.id).subscribe({
      next: () => {
        this.toastr.success("Car is successfully deleted!!!");
      },
      error: (error) => {
        this.toastr.error(error.error.message);
      }
    })
  }

}
