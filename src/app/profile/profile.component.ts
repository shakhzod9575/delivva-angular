import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProfileData } from '../services/models/profile-data-model';
import { ProfileService } from '../services/profile/profile.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  firstName: FormGroup;
  lastName: FormGroup;
  phoneNumber: FormGroup;
  username: FormGroup;
  photoInput: FormGroup;
  file!: File;

  isFirstNameProvided: boolean = false;
  isLastNameProvided: boolean = false;
  isPhoneNumberValid: boolean = false;
  isUsernameProvided: boolean = false;
  countryCodes: { [key: string]: string } = {
    'uzb': '+998',
    '1': '+972',
    '2': '+198',
    '3': '+701'
  };

  constructor(
    private fb: FormBuilder,
    private service: ProfileService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.firstName = this.fb.group({
      firstName: ['', [Validators.required, this.customFullNameValidator()]]
    });
    this.lastName = this.fb.group({
      lastName: ['', [Validators.required, this.customFullNameValidator()]]
    });
    this.phoneNumber = this.fb.group({
      countryCode: ['uzb', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
    this.username = this.fb.group({
      username: ['', [Validators.required, this.customUsernameValidator()]]
    });
    this.photoInput = this.fb.group({
      photo: [null]
    });
  }
  ngOnInit(): void {

  }

  customUsernameValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const lettersWithOptionalNumbersPattern = /^[a-zA-Z0-9]*$/;
      if (!lettersWithOptionalNumbersPattern.test(value)) {
        return { invalidFormat: true };
      }
      return null;
    };
  }

  customFullNameValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const lettersWithOptionalNumbersPattern = /^[a-zA-Z]*$/;
      if (!lettersWithOptionalNumbersPattern.test(value)) {
        return { invalidFormat: true };
      }
      return null;
    };
  }

  validateFirstName() {
    this.isFirstNameProvided = !this.firstName.get('firstName')?.hasError('required') && !this.firstName.get('firstName')?.hasError('invalidFormat');
  }

  validateLastName() {
    this.isLastNameProvided = !this.lastName.get('lastName')?.hasError('required') && !this.lastName.get('lastName')?.hasError('invalidFormat');
  }

  validatePhoneNumber() {
    this.isPhoneNumberValid = !this.phoneNumber.get('phoneNumber')?.hasError('required') && !this.phoneNumber.get('phoneNumber')?.hasError('pattern');
  }

  validateUsername() {
    this.isUsernameProvided = !this.username.get('username')?.hasError('required') && !this.username.get('username')?.hasError('invalidFormat');
  }

  checkAllOverCorrectness() {
    return this.isFirstNameProvided && this.isLastNameProvided && this.isPhoneNumberValid && this.isUsernameProvided;
  }

  onFileChange(event: any) {
    this.file = event.target.files.item(0);
  }

  onSubmit() {
    const data: ProfileData = new ProfileData(
      Number(localStorage.getItem('userId')),
      this.firstName.value.firstName,
      this.lastName.value.lastName,
      this.countryCodes[this.phoneNumber.value.countryCode] + this.phoneNumber.value.phoneNumber,
      this.username.value.username
    );
    const jsonData = {
      userId: Number(localStorage.getItem('userId')),
      firstName: this.firstName.value.firstName,
      lastName: this.lastName.value.lastName,
      username: this.username.value.username,
      phoneNumber: this.countryCodes[this.phoneNumber.value.countryCode] + this.phoneNumber.value.phoneNumber
    };
    console.log(data);
    this.service.saveUserProfile(jsonData).subscribe({
      next: (data: any) => {
        this.toastr.success("Your registration is now complete. Please login to continue!!")
        this.service.savePhoto(this.file);
        this.router.navigateByUrl("/login");
      },
      error: (error: any) => {
        const status = error.error.status;
        const message = error.error.message;
        if (status === 400) {
          this.toastr.error(message);
        }
      }
    });
  }
}
