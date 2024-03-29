import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CarType } from '../services/models/car-type';
import { Courier } from '../services/models/courier';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserData } from '../services/models/get-me-data';

@Component({
  selector: 'app-car-type',
  templateUrl: './car-type.component.html',
  styleUrls: ['./car-type.component.css']
})
export class CarTypeComponent implements OnInit {

  carTypeUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/vehicle-types';
  couriersByCarType: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/users/by-car-type';
  vehicleTypes?: CarType[];
  selectedVehicleType?: CarType;
  couriers?: Courier[];

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}


  ngOnInit(): void {
    this.http.get<CarType[]>(this.carTypeUrl)
            .subscribe({
              next: (data) => {
                this.vehicleTypes = data;
                console.log(data);
              }
            });
  }

  onVehicleTypeChange() {
    if(this.selectedVehicleType && this.selectedVehicleType.id !== undefined) {
      this.loadCourier(this.selectedVehicleType.id)
    }
  }

  loadCourier(vehicleTypeId: number) {
    const params = new HttpParams()
                .set('carType', this.selectedVehicleType?.name || "");
    this.http.get<Courier[]>(this.couriersByCarType, {params: params})
              .subscribe({
                next: (data: Courier[]) => {
                  this.couriers = data;
                }
              });
  }

  inviteUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/offer-by-customer';

  onSubmit() {
    this.router.navigateByUrl('/my-orders/list');
  }

  sendInvitation(courier: Courier) {
    const courierId = Number(courier.id);
    const orderId = Number(localStorage.getItem('orderId'));
    const orderInviteDTO = {
      userId: courierId,
      orderId: orderId
    };
    console.log(orderInviteDTO);

    this.http.post(this.inviteUrl, orderInviteDTO).subscribe({
      next: () => {
        this.toastr.success("Invitation is successfully sent!!!");
      }
    })
  }
}
