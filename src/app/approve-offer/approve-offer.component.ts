import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approve-offer',
  templateUrl: './approve-offer.component.html',
  styleUrls: ['./approve-offer.component.css']
})
export class ApproveOfferComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  approveOrderUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/approve-offer'

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      const orderId = params['orderId'];
      const userId = params['userId'];
      this.http.get(this.approveOrderUrl + `?userId=${userId}&orderId=${orderId}`)
                      .subscribe({
                        next: () => {
                          this.router.navigateByUrl("/dashboard");
                          this.toastr.info("You approved the order offer!!!");
                        },
                        error: (error: any) => {
                          this.toastr.error(error.error.message);
                        }
                      })
    });
  }

}
