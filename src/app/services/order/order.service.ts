import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  url: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders';
  mapUrl: string = 'https://nominatim.openstreetmap.org/reverse';

  getOrderById(orderId: Number) {
    const orderUrl = this.url + "/" + orderId;
    return this.http.get<Order>(orderUrl);
  }
}
