import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import { CarTypeComponent } from './car-type/car-type.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { EmailComponent } from './email/email.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { IntroComponent } from './intro/intro.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderC2Component } from './order-c2/order-c2.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpRequest } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderCreationComponent } from './order-creation/order-creation.component';
import { OsmViewComponent } from './osm-view/osm-view.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileDataComponent } from './profile-data/profile-data.component';
import { RegistrationComponent } from './registration/registration.component';
import { ResendEmailComponent } from './resend-email/resend-email.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { VerificationComponent } from './verification/verification.component'
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { CookieService } from 'ngx-cookie-service';
import { CustomInterceptor } from './custom.interceptor';
import { AddCarComponent } from './add-car/add-car.component';
import { DeliveryComponent } from './delivery/delivery.component';
import { OrderListComponent } from './order-list/order-list.component';
import {MatTableModule} from '@angular/material/table'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSortModule} from '@angular/material/sort'
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'
import { RatingComponent } from './rating/rating.component';
import { ToastrModule } from 'ngx-toastr';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider
} from '@abacritt/angularx-social-login';
import {  GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { DisputeComponent } from './dispute/dispute.component';
import { MatIconModule } from '@angular/material/icon';
import { MyOrderComponent } from './my-order/my-order.component';
import { JwtModule } from "@auth0/angular-jwt";
import { MyOrderListComponent } from './my-order-list/my-order-list.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DeliveryHistoryComponent } from './delivery-history/delivery-history.component';
import { DeliveryListComponent } from './delivery-list/delivery-list.component';
import { OrderHistoryDataComponent } from './order-history-data/order-history-data.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { DisputeListComponent } from './dispute-list/dispute-list.component';
import { DeliveryHistoryDataComponent } from './delivery-history-data/delivery-history-data.component';
import { DisputeDataComponent } from './dispute-data/dispute-data.component';
import { SeeOrderComponent } from './see-order/see-order.component';
import { DeliveryDataComponent } from './delivery-data/delivery-data.component';
import { ApproveOfferComponent } from './approve-offer/approve-offer.component';


@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    CarTypeComponent,
    DashboardComponent,
    EditProfileComponent,
    EmailComponent,
    GalleryComponent,
    HomeComponent,
    IntroComponent,
    LoginComponent,
    OrderC2Component,
    OrderCreationComponent,
    OsmViewComponent,
    ProfileComponent,
    ProfileDataComponent,
    RegistrationComponent,
    ResendEmailComponent,
    TestimonialsComponent,
    VerificationComponent,
    AddCarComponent,
    DeliveryComponent,
    OrderListComponent,
    RatingComponent,
    DisputeComponent,
    MyOrderComponent,
    MyOrderListComponent,
    OrderHistoryComponent,
    DeliveryHistoryComponent,
    DeliveryListComponent,
    OrderHistoryDataComponent,
    AdminDashboardComponent,
    DisputeListComponent,
    DeliveryHistoryDataComponent,
    DisputeDataComponent,
    SeeOrderComponent,
    DeliveryDataComponent,
    ApproveOfferComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    GoogleSigninButtonModule,
    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: (): string | null => {
            return localStorage.getItem('token') || null;
        },
        allowedDomains: ["http://localhost:4200", "http://delivva-front-end.s3-website-us-east-1.amazonaws.com"],
        disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    })
  ],
  providers: [
    HttpClient,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor,
      multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '693366417583-suspsipkaa3pkbo423muu8bf2viqpa28.apps.googleusercontent.com'
            )
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
