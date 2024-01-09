import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {

  private orderDataSource = new BehaviorSubject<Order | null>(null);
  currentOrder = this.orderDataSource.asObservable();

  constructor() { }

  setCurrentOrder(receivedOrder: Order) {
    this.orderDataSource.next(receivedOrder);
  }
}
