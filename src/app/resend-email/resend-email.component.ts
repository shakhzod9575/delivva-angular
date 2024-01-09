import { HttpClient, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.html',
  styleUrls: ['./resend-email.component.css']
})
export class ResendEmailComponent {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  private resendUrl: string = 'http://Delivva-testing-environment-env.eba-jighrhr6.us-east-1.elasticbeanstalk.com/api/v1/auth/resend-confirmation';

  onSubmit() {
    const email = localStorage.getItem('userEmail');
    if(email !== null) {
      let params = new HttpParams()
                  .set('email', email);
      this.http.get(this.resendUrl, {params: params})
                .subscribe({
                  next: () => {
                    this.router.navigateByUrl("/verify");
                  },
                  error: (error: any) => {
                    alert(error.error.message);
                  }
                })
    }
  }
}
