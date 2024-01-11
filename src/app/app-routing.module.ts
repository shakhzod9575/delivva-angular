import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailComponent } from './email/email.component';
import { OsmViewComponent } from './osm-view/osm-view.component';
import { ProfileComponent } from './profile/profile.component';
import { OrderC2Component } from './order-c2/order-c2.component';
import { OrderCreationComponent } from './order-creation/order-creation.component';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { VerificationComponent } from './verification/verification.component';
import { ResendEmailComponent } from './resend-email/resend-email.component';
import { CarTypeComponent } from './car-type/car-type.component';
import { AddCarComponent } from './add-car/add-car.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { OrderListComponent } from './order-list/order-list.component';
import { RatingComponent } from './rating/rating.component';
import { DisputeComponent } from './dispute/dispute.component';
import { MyOrderComponent } from './my-order/my-order.component';
import { MyOrderListComponent } from './my-order-list/my-order-list.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DeliveryHistoryComponent } from './delivery-history/delivery-history.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { OrderHistoryDataComponent } from './order-history-data/order-history-data.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DeliveryHistoryDataComponent } from './delivery-history-data/delivery-history-data.component';
import { DisputeListComponent } from './dispute-list/dispute-list.component';
import { DisputeDataComponent } from './dispute-data/dispute-data.component';
import { SeeOrderComponent } from './see-order/see-order.component';
import { DeliveryDataComponent } from './delivery-data/delivery-data.component';
import { ApproveOfferComponent } from './approve-offer/approve-offer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegistrationComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'dashboard/admin',
    component: AdminDashboardComponent
  },
  {
    path: 'verify',
    component: EmailComponent
  },
  {
    path: 'create-order/destination',
    component: OsmViewComponent
  },
  {
    path: 'my-orders/invite',
    component: CarTypeComponent
  },
  {
    path: 'create-order/date',
    component: OrderC2Component
  },
  {
    path: 'car/register',
    component: AddCarComponent
  },
  {
    path: 'fill-profile',
    component: ProfileComponent
  },
  {
    path: 'profile',
    component: ProfileDataComponent
  },
  {
    path: 'profile/edit',
    component: EditProfileComponent
  },
  {
    path: 'confirm',
    component: VerificationComponent
  },
  {
    path: 'resend',
    component: ResendEmailComponent
  },
  {
    path: 'create-order',
    component: OrderCreationComponent
  },
  {
    path: 'orders/data',
    component: DeliveryComponent
  },
  {
    path: 'orders/list',
    component: OrderListComponent
  },
  {
    path: 'orders/rate',
    component: RatingComponent
  },
  {
    path: 'orders/disputes',
    component: DisputeComponent
  },
  {
    path: 'my-orders/data',
    component: MyOrderComponent
  },
  {
    path: 'my-orders/list',
    component: MyOrderListComponent
  },
  {
    path: 'my-orders/history',
    component: OrderHistoryComponent
  },
  {
    path: 'my-orders/history/data',
    component: OrderHistoryDataComponent
  },
  {
    path: 'my-delivery/history',
    component: DeliveryHistoryComponent
  },
  {
    path: 'my-delivery/history/data',
    component: DeliveryHistoryDataComponent
  },
  {
    path: 'my-delivery/list',
    component: DeliveryListComponent
  },
  {
    path: 'my-delivery/data',
    component: DeliveryDataComponent
  },
  {
    path: 'dispute/list',
    component: DisputeListComponent
  },
  {
    path: 'dispute/data',
    component: DisputeDataComponent
  },
  {
    path: 'orders/data/visualize',
    component: SeeOrderComponent
  },
  {
    path: 'approve-offer',
    component: ApproveOfferComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
