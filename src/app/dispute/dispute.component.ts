import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DisputeData } from '../services/models/dispute';
import { HttpClient } from '@angular/common/http';
import { Dispute } from '../services/models/dispute-data';
import { UserData } from '../services/models/get-me-data';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth/auth.service';
import { SingleDisputeData } from '../services/models/single-dispute';

@Component({
  selector: 'app-dispute',
  templateUrl: './dispute.component.html',
  styleUrls: ['./dispute.component.css']
})
export class DisputeComponent {

  disputeTypes!: DisputeData[];
  disputeUser!: UserData;
  selectedDisputeType!: DisputeData;
  catchDisputeType!: DisputeData;
  enteredDescription!: string;
  dispute!: SingleDisputeData;

  disputeTypeUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/dispute-types';
  disputeDataUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/disputes'

  commentForm!: FormGroup;
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) {
    this.http.get<DisputeData[]>(this.disputeTypeUrl).subscribe({
      next: (data: any) => {
        this.disputeTypes = data;
      }
    });
  }

  ngOnInit() {
    const orderId = Number(localStorage.getItem('orderId'));
    this.http.get<SingleDisputeData>(this.disputeDataUrl + `/${orderId}`).subscribe({
      next: (data: SingleDisputeData) => {
        console.log(data);
        this.dispute = data;
        const userId = this.dispute.userId;
        if (userId != undefined) {
          this.authService.getUserById(userId).subscribe({
            next: (userData: UserData) => this.disputeUser = userData
          });
        }
      }
    })
  }

  onDisputeTypeChange() {
    console.log(this.disputeTypes);
    console.log(this.selectedDisputeType);
    console.log(this.enteredDescription);
  }

  validateInputs() {
    return !!this.selectedDisputeType && !!this.enteredDescription;
  }

  onSubmit() {
    const dispute = {
      orderId: Number(localStorage.getItem('orderId')),
      disputeTypeId: this.selectedDisputeType.id,
      userId: Number(localStorage.getItem('userId')),
      description: this.enteredDescription
    };
    console.log(dispute);
    this.http.post<any>(this.disputeDataUrl, dispute).subscribe({
      next: (data: any) => {
        this.toastr.success("Dispute is raised successfully!!!");
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    })
  }
}
