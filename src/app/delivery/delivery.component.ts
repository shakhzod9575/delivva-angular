import { Component, Input, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon } from 'ol/style';
import { Router } from '@angular/router';
import { Order } from '../services/models/order';
import { DataTransferService } from '../services/data-transfer/data-transfer.service';
import { OrderService } from '../services/order/order.service';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {

  public map!: Map
  private count = 0;
  data!: Order;
  username!: string;

  constructor(private orderService: OrderService) {
   }

  ngOnInit(): void {
    const orderId = Number(localStorage.getItem('orderId'));
    this.orderService.getOrderById(orderId).subscribe({
      next: (orderData: any) => {
        this.data = orderData;
        this.initMap(this.data);
      }
    });
  }

  initMap(order: Order) {
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({
            attributions: []
          }),
        }),
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2, maxZoom: 18,

      }),
    });
    console.log(order);
    const fromCoordinates = fromLonLat([Number(order.startingDestination.longitude), Number(order.startingDestination.latitude)]);
    const toCoordinates = fromLonLat([Number(order.finalDestination.longitude), Number(order.finalDestination.latitude)]);
    const extent = [
      Math.min(fromCoordinates[0], toCoordinates[0]),
      Math.min(fromCoordinates[1], toCoordinates[1]),
      Math.max(fromCoordinates[0], toCoordinates[0]),
      Math.max(fromCoordinates[1], toCoordinates[1]),
    ];

    this.map.getView().fit(extent, { padding: [20, 20, 20, 20], duration: 1000 });

    this.addMarker([
      [Number(order.startingDestination.longitude), Number(order.startingDestination.latitude)],
      [Number(order.finalDestination.longitude), Number(order.finalDestination.latitude)]
    ]);
  }

  addMarker(coordinatesArray: [number, number][]): void {
    let src: string = '';
    let color: string = '';
    const markers = coordinatesArray.map(coordinates => {
      return new Feature({
        geometry: new Point(fromLonLat(coordinates)),
      });
    });

    markers.forEach(marker => {
      if (this.count === 0) {
        src = '../../assets/images/blue-marker.svg';
        color = 'blue';
      } else if(this.count === 1) {
        src = '../../assets/images/red-marker.svg'
        color = 'red';
      } else {
        src = '../../assets/images/Car.svg';
        color = 'blue';
      }

      this.count++;
      marker.setStyle(
        new Style({
          image: new Icon({
            color: color,
            crossOrigin: 'anonymous',
            src: src,
            scale: 0.6,
          }),
        })
      );
      console.log(this.count);
    });

    this.count = 0;

    let vectorLayer = this.map.getLayers().getArray().find((layer) => layer instanceof VectorLayer) as VectorLayer<VectorSource>;

    vectorLayer = new VectorLayer<VectorSource>({
      source: new VectorSource({
        features: markers,
      }),
    });

    this.map.addLayer(vectorLayer);
  }

}
