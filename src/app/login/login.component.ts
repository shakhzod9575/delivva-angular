import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '../services/models/Token-data';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: FormGroup;
  password: FormGroup;

  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private cookieService: CookieService,
    private authService: SocialAuthService,
    private toastr: ToastrService,
    private jwtHelper: JwtHelperService
  ) {
    this.username = this.fb.group({
      username: ['', [Validators.required, this.customUsernameValidator()]]
    })
    this.password = this.fb.group({
      password: ['', Validators.required]
    })
  }

  isUsernameValid: boolean = false;
  isPasswordValid: boolean = false;

  customUsernameValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const lettersWithOptionalNumbersPattern = /^[a-zA-Z0-9]*$/;
      if (!emailPattern.test(value) && !lettersWithOptionalNumbersPattern.test(value)) {
        return { invalidFormat: true };
      }
      return null;
    };
  }

  validateUsername() {
    this.isUsernameValid = !this.username.get('username')?.hasError('invalidFormat') && !this.username.get('username')?.hasError('required');
  }

  validatePassword() {
    this.isPasswordValid = !this.password.get('password')?.hasError('required');
  }

  checkAllCorrect() {
    return this.isUsernameValid && this.isPasswordValid;
  }

  loginToAccount() {
    let loginData = {
      login: this.username.value.username,
      password: this.password.value.password
    };
    this.loginService.loginViaCredentials(loginData)
      .subscribe({
        next: (data: Token) => {
          const token = data.accessToken;
          if (token !== undefined) {
            this.cookieService.set('token', token);
            localStorage.setItem('token', token);
            const decodedToken = this.jwtHelper.decodeToken(token);
            const role = decodedToken['authorities'][0]['authority'];
            localStorage.setItem('role', role);
            if(role === 'ROLE_USER') {
            this.router.navigateByUrl("/dashboard")
            } else {
              this.router.navigateByUrl("/dashboard/admin");
            }
          }
        },
        error: (error: any) => {
          const message = error.error.message;
          if(message === 'VERIFIED') {
            this.router.navigateByUrl('/fill-profile');
            this.toastr.error("You should fill this form first to login!!!")
          } else if(message === 'CREATED') {
            this.router.navigateByUrl('/verify');
            this.toastr.error("You should verify your email first!!!");
          } else if(message === 'DELETED') {
            this.toastr.error("This email has not been registered yet. Please register first");
          } else {
            this.toastr.error(message);
          }
        }
      });
  }

  user!: SocialUser;
  loggedIn!: boolean;

  signOut() {
  }

  loginoath2Url = ''

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      const email = this.user.email;
      this.loginService.loginViaOauth(email).subscribe({
        next: (data: Token) => {
          const token = data.accessToken;
          console.log(token);
          if (token !== undefined) {
            this.cookieService.set('token', token);
            localStorage.setItem('token', token);
            const decodedToken = this.jwtHelper.decodeToken(token);
            const role = decodedToken['authorities'][0]['authority'];
            localStorage.setItem("role", role);
            if(role === 'ROLE_USER') {
            this.router.navigateByUrl("/dashboard")
            } else {
              this.router.navigateByUrl("/dashboard/admin");
            }
          }
        },
        error: (error: any) => {
          const message = error.error.message;
          this.toastr.error(message);
        }
      })
    });
  }

}
