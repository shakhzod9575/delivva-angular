import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      const token = params['token'];
      console.log(token);
      this.authService.confirmEmail(token)
                      .subscribe({
                        next: () => {
                          this.router.navigateByUrl("/fill-profile");
                        },
                        error: (error: any) => {
                          const status = error.error.status;
                          if(status === 401) {
                            this.router.navigateByUrl("/resend");
                          }
                        }
                      })
    });
  }
}
