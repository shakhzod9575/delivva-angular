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

  approveOrderUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/orders/approve-offer'

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      const orderId = params['orderId'];
      const userId = params['userId'];
      this.http.get(this.approveOrderUrl + `?userId=${userId}&orderId=${orderId}`)
                      .subscribe({
                        next: () => {
                          this.router.navigateByUrl("/login");
                          this.toastr.info("You approved the order offer. Please login to see the changes!!!");
                        },
                        error: (error: any) => {
                          this.toastr.error(error.error.message);
                        }
                      })
    });
  }

}
