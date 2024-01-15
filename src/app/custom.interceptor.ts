import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  private excludedUrls: string[] = [
    '/auth/login', 
    '/auth/register',
    '/auth/login-oauth',
    '/auth/confirm-email',
    '/auth/resend-confirmation',
    '/auth/users/fill-profile',
    '/auth/users/picture',
    '/auth/users/by-car-type'
  ];

  constructor(private router: Router, private cookieService: CookieService, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isExcludedUrl(request.url)) {
      return next.handle(request);
    }

    const token = localStorage.getItem('token');
    const newRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(newRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.toastr.error("Please login to continue");
          this.router.navigate(['login']);
        }
        return throwError(() => error);
      })
    );
  }

  private isExcludedUrl(url: string): boolean {
    return this.excludedUrls.some((excludedUrl) => url.indexOf(excludedUrl) !== -1);
  }
}
