import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProfileData } from '../services/models/profile-data-model';
import { UserData } from '../services/models/get-me-data';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile/profile.service';
import { RatingResponse } from '../services/models/rating-response';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedPhotoUrl: string = 'https://static.vecteezy.com/system/resources/thumbnails/019/900/322/small/happy-young-cute-illustration-face-profile-png.png';
  newPhotoUrl: string = 'https://static.vecteezy.com/system/resources/thumbnails/019/900/322/small/happy-young-cute-illustration-face-profile-png.png';
  userData!: UserData;
  firstName: FormGroup;
  lastName: FormGroup;
  phoneNumber: FormGroup;
  username: FormGroup;
  oldFirstName!: string;
  oldLastName!: string;
  oldPhoneNumber!: string;
  oldUsername!: string;
  newFirstName!: string;
  newLastName!: string;
  newPhoneNumber!: string;
  newUsername!: string;
  selectedPhotoInFile!: File;
  rating!: RatingResponse;
  userRole!: string;

  getRatingUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/evaluations/get-courier-rating';


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private service: ProfileService
  ) {
    this.userRole = localStorage.getItem('role') || '';
    this.firstName = this.fb.group({
      firstName: ['', [Validators.required, this.customFullNameValidator()]]
    });
    this.lastName = this.fb.group({
      lastName: ['', [Validators.required, this.customFullNameValidator()]]
    });
    this.phoneNumber = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.pattern(/\+[0-9]+/)]]
    });
    this.username = this.fb.group({
      username: ['', [Validators.required, this.customUsernameValidator()]]
    });
    const userId = Number(localStorage.getItem('userId'));
    this.http.get<RatingResponse>(this.getRatingUrl + `?id=${userId}`).subscribe({
      next: (ratingData: RatingResponse) => {
        this.rating = ratingData;
      }
    })
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const selectedFile = event.target.files[0];
    this.selectedPhotoInFile = event.target.files[0];
    console.log(selectedFile);
    this.resizePhoto(selectedFile, (resizedImage: string) => {
      this.selectedPhotoUrl = resizedImage;
    });
    this.newPhotoUrl = URL.createObjectURL(selectedFile);
  }

  resizePhoto(file: File, callback: (resizedImage: string) => void) {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const maxWidth = 200;
        const maxHeight = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            width = maxWidth;
            height = maxHeight;
          }
        } else {
          if (height > maxHeight) {
            height = maxHeight;
            width = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const originalMimeType = file.type;
        const resizedImage = canvas.toDataURL(originalMimeType);
        console.log('Selected file:', resizedImage);
        callback(resizedImage);
      };
    };

    reader.readAsDataURL(file);
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

  private getMeUrl = 'https://fm7kgpvst4.execute-api.us-east-1.amazonaws.com/auth/users';

  ngOnInit(): void {
    this.http.get<UserData>(this.getMeUrl).subscribe({
      next: (data: UserData) => {
        this.userData = data;
        this.oldFirstName = data.firstName || "";
        this.oldLastName = data.lastName || "";
        this.oldPhoneNumber = data.phoneNumber || "";
        this.oldUsername = data.username || "";
        this.newFirstName = data.firstName || "";
        this.newLastName = data.lastName || "";
        this.newPhoneNumber = data.phoneNumber || "";
        this.newUsername = data.username || "";
        const link = data.photoLink;
        if (link != null) {
          this.selectedPhotoUrl = link;
          this.newPhotoUrl = link;
        }
      }
    })
  }

  validateAll() {
    if (
      this.newFirstName != "" &&
      this.newLastName != "" &&
      this.newUsername != "" &&
      this.newPhoneNumber != ""
    ) {
      const pattern = /^\+[0-9]+$/;
      const fullNamePattern = /^[A-Za-z]+$/;
      let check = false;
      if (this.newFirstName !== this.oldFirstName && fullNamePattern.test(this.newFirstName)) {
        check = true;
      } else if (this.newLastName !== this.oldLastName && fullNamePattern.test(this.newLastName)) {
        check = true;
      } else if (this.newPhoneNumber !== this.oldPhoneNumber && pattern.test(this.newPhoneNumber)) {
        check = true;
      } else if (this.newUsername !== this.oldUsername) {
        check = true;
      } else if (this.newPhotoUrl !== this.selectedPhotoUrl) {
        check = true;
      } else {
        check = false;
      }
      return check;
    } else {
      return false;
    }
  }

  saveChanges() {
    const updateData = {
      userId: Number(localStorage.getItem('userId')),
      firstName: this.newFirstName,
      lastName: this.newLastName,
      username: this.newUsername,
      phoneNumber: this.newPhoneNumber
    };
    console.log(updateData);
    this.http.put<any>(this.getMeUrl, updateData).subscribe({
      next: (data: any) => {
        console.log(data);
        this.toastr.success("Profile is successfully updated!!!");
        if (this.selectedPhotoInFile != null) {
          this.service.savePhoto(this.selectedPhotoInFile);
        }
        if (this.userRole === 'ROLE_USER') {
          this.router.navigateByUrl("/dashboard");
        } else if (this.userRole === 'ROLE_ADMIN') {
          this.router.navigateByUrl('/dashboard/admin')
        }
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    })
  }

}
