import { Component, OnInit } from '@angular/core';
import { CarType } from '../services/models/car-type';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent implements OnInit {

  vehicleTypes?: CarType[];
  carTypeUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/vehicle-types';
  selectedVehicleType: FormGroup;
  selectedColor: FormGroup;
  carModel: FormGroup;
  registrationNumber: FormGroup;
  isTypeSelected: boolean = false;
  isColorSelected: boolean = false;
  isCarModelEntered: boolean = false;
  isRegNumEntered: boolean = false;

  colors?: string[] = [
    'Red',
    'Blue',
    'Black',
    'White',
    'Green',
    'Grey'
  ];

  constructor(
    private http: HttpClient, 
    private fb: FormBuilder, 
    private toastr: ToastrService,
    private router: Router
  ) {
    this.selectedVehicleType = this.fb.group({
      selectedVehicleType: ['', [Validators.required]]
    });
    this.selectedColor = this.fb.group({
      selectedColor: ['', [Validators.required]]
    });
    this.carModel = this.fb.group({
      carModel: ['', [Validators.required]]
    });
    this.registrationNumber = this.fb.group({
      registrationNumber: ['', [Validators.required]]
    });
  }

  validateVehicleType() {
    this.isTypeSelected = !this.selectedVehicleType.get('selectedVehicleType')?.hasError('required');
  }

  validateColor() {
    this.isColorSelected = !this.selectedColor.get('selectedColor')?.hasError('required');
  }

  validateCarModel() {
    this.isCarModelEntered = !this.carModel.get('carModel')?.hasError('required');
  }

  validateRegNum() {
    this.isRegNumEntered = !this.registrationNumber.get('registrationNumber')?.hasError('required');
  }

  ngOnInit(): void {
    this.http.get<CarType[]>(this.carTypeUrl)
            .subscribe({
              next: (data) => {
                this.vehicleTypes = data;
                console.log(data);
              },
              error: (error) => {
                console.log(error.error.message);
              }
            });
  }

  validateAll() {
    return this.isColorSelected && this.isTypeSelected && this.isCarModelEntered && this.isRegNumEntered;
  }

  carRegisterUrl: string = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/vehicles'

  onSubmit() {
    const carData = {
      userId: Number(localStorage.getItem('userId')),
      vehicleTypeId: this.selectedVehicleType.value.selectedVehicleType.id,
      model: this.carModel.value.carModel,
      color: this.selectedColor.value.selectedColor,
      registrationNumber: this.registrationNumber.value.registrationNumber
    };
    this.http.post<any>(this.carRegisterUrl, carData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.router.navigateByUrl('/dashboard');
        this.toastr.success("Car is successfully registered. You can see it on My Profile section!!!");
      },
      error: (error: any) => {
        const message = error.error.message;
        if(message != null)
        this.toastr.error("Already have a car. You can register only one car!!!");
        this.router.navigateByUrl('/dashboard');
      }
    })
  }

}
