import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  url: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/orders';
  mapUrl: string = 'https://nominatim.openstreetmap.org/reverse';

  getOrderById(orderId: Number) {
    const orderUrl = this.url + "/" + orderId;
    return this.http.get<Order>(orderUrl);
  }
}
