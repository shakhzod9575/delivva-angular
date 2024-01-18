import { Component, Input, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Icon, Text, Fill, Stroke } from 'ol/style';
import { Router } from '@angular/router';
import { Order } from '../services/models/order';
import { OrderService } from '../services/order/order.service';
import { HttpClient } from '@angular/common/http';
import LineString from 'ol/geom/LineString';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { RatingComponent } from '../rating/rating.component';
import { TrackNumber } from '../services/models/track-number';
import { CurrentGeolocation } from '../services/models/current-geolocation';
import { ArrowsControl } from '../services/models/SpeedDetector';
import { Zoom } from 'ol/control';

@Component({
  selector: 'app-delivery-data',
  templateUrl: './delivery-data.component.html',
  styleUrls: ['./delivery-data.component.css']
})
export class DeliveryDataComponent implements OnInit {

  public map!: Map
  private count = 0;
  data!: Order;
  username!: string;
  currentUserId!: number;
  trackNumber!: TrackNumber;
  currentGeo!: CurrentGeolocation;
  currentSpeed!: number;
  arrowControl!: ArrowsControl;

  getTruckNumberUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/track-number';
  currentGeoLocationUrl: string = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/geo/current';

  constructor(
    private orderService: OrderService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private matRef: MatDialog
  ) {
    this.currentUserId = Number(localStorage.getItem('userId'));
    this.http.get(this.getTruckNumberUrl + `?orderId=${localStorage.getItem('orderId')}`).subscribe({
      next: (trackData: any) => {
        this.trackNumber = trackData;
        this.http.get(this.currentGeoLocationUrl + `?trackNumber=${this.trackNumber.trackNumber}`).subscribe({
          next: (data: any) => {
            this.currentGeo = data;
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.currentSpeed = Math.floor(Math.random() * 150);
    setInterval(() => {
      // Generate a random number between 0 and 200
      const randomValue = Math.floor(Math.random() * 150);

      // Update the dynamic value with the random number
      this.currentSpeed = randomValue;
    }, 5000);
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
      controls: [],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
        maxZoom: 18,

      }),
    });

    console.log(order);
    console.log(this.currentGeo)
    const fromCoordinates = fromLonLat([Number(order.startingDestination.longitude), Number(order.startingDestination.latitude)]);
    const toCoordinates = fromLonLat([Number(order.finalDestination.longitude), Number(order.finalDestination.latitude)]);
    const extent = [
      Math.min(fromCoordinates[0], toCoordinates[0]),
      Math.min(fromCoordinates[1], toCoordinates[1]),
      Math.max(fromCoordinates[0], toCoordinates[0]),
      Math.max(fromCoordinates[1], toCoordinates[1]),
    ];

    this.map.getView().fit(extent, { padding: [20, 20, 20, 20], duration: 1000 });

    if (this.data.deliveryStartedAt && this.currentGeo != undefined && !this.data.deliveryFinishedAt) {
      this.addMarker([
        [Number(order.startingDestination.longitude), Number(order.startingDestination.latitude)],
        [Number(order.finalDestination.longitude), Number(order.finalDestination.latitude)],
        [Number(this.currentGeo.path[0].longitude), Number(this.currentGeo.path[0].latitude)]
      ]);
    } else if(this.data.deliveryStartedAt && !this.data.deliveryFinishedAt && this.currentGeo === undefined) {
      this.addMarker([
        [Number(order.startingDestination.longitude), Number(order.startingDestination.latitude)],
        [Number(order.finalDestination.longitude), Number(order.finalDestination.latitude)],
        [Number(order.startingDestination.longitude), Number(order.startingDestination.latitude)]
      ]);
    } else {
      this.addMarker([
        [Number(order.startingDestination.longitude), Number(order.startingDestination.latitude)],
        [Number(order.finalDestination.longitude), Number(order.finalDestination.latitude)]
      ]);
    }
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
      } else if (this.count === 1) {
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
          })
        })
      );
    });


    this.count = 0;

    let vectorLayer = this.map.getLayers().getArray().find((layer) => layer instanceof VectorLayer) as VectorLayer<VectorSource>;

    vectorLayer = new VectorLayer<VectorSource>({
      source: new VectorSource({
        features: markers,
      }),
    });
    if (this.data.deliveryStartedAt && !this.data.deliveryFinishedAt) {
      setInterval(() => {
        const randomValue = Math.floor(Math.random() * 150);

        this.currentSpeed = randomValue;

        if (!this.arrowControl) {
          this.arrowControl = new ArrowsControl(this.map, this.currentSpeed);
          this.map.addControl(this.arrowControl);
        } else {
          this.arrowControl.updateSpeedContent(this.currentSpeed);
        }

      }, 5000);
    }
    this.map.addControl(new Zoom())
    this.map.addLayer(vectorLayer);

    if (this.data.deliveryStartedAt && !this.data.deliveryFinishedAt) {
      const routeCoordinatesFrom = coordinatesArray[0];
      const routeCoordinatesTo = coordinatesArray[2];
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62487dc5a35097cb461f9671bec1d23408fe&start=${routeCoordinatesFrom[0]},${routeCoordinatesFrom[1]}&end=${routeCoordinatesTo[0]},${routeCoordinatesTo[1]}`;
      this.http.get(url).subscribe({
        next: (routeData: any) => {
          const coordinates = routeData.features[0].geometry.coordinates;
          const route = new LineString(coordinates).transform('EPSG:4326', 'EPSG:3857');
          const feature = new Feature(route);
          const vectorSource = vectorLayer!.getSource();
          if (vectorSource != null) {
            vectorSource.addFeature(feature);
          }
        },
        error: (error) => {
          console.error('Error fetching route:', error);
        }
      }
      );
    } else if(this.data.deliveryFinishedAt) {
      const routeCoordinatesFrom = coordinatesArray[0];
      const routeCoordinatesTo = coordinatesArray[1];
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62487dc5a35097cb461f9671bec1d23408fe&start=${routeCoordinatesFrom[0]},${routeCoordinatesFrom[1]}&end=${routeCoordinatesTo[0]},${routeCoordinatesTo[1]}`;
      this.http.get(url).subscribe({
        next: (routeData: any) => {
          const coordinates = routeData.features[0].geometry.coordinates;
          const route = new LineString(coordinates).transform('EPSG:4326', 'EPSG:3857');
          const feature = new Feature(route);
          const vectorSource = vectorLayer!.getSource();
          if (vectorSource != null) {
            vectorSource.addFeature(feature);
          }
        },
        error: (error) => {
          console.error('Error fetching route:', error);
        }
      }
      );
    }
  }

  private cancelOrderUrl = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/cancel';

  cancelAnOrder() {
    const cancelOrder = {
      userId: Number(localStorage.getItem('userId')),
      orderId: Number(localStorage.getItem('orderId'))
    };
    this.http.post(this.cancelOrderUrl, cancelOrder).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: any) => {
        if (error.status === 400) {
          this.toastr.success("Order is cancelled successfully!!!");
        } else {
          console.log(error.error.message);
        }
      }
    })
  }

  rateOrder() {
    const orderId = Number(localStorage.getItem('orderId'));
    if (orderId != undefined) {
      this.matRef.open(RatingComponent);
    }
  }


  private startTheDeliveryUrl = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/status'

  startTheDelivery() {
    const orderId = Number(localStorage.getItem('orderId'));
    const status = 'IN_PROGRESS';
    const startTheDeliveryData = {
      id: orderId,
      status: status
    };
    this.http.put(this.startTheDeliveryUrl, startTheDeliveryData).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    })
  }

  private finishTheOrderUrl = 'https://ybp0yqkx10.execute-api.eu-north-1.amazonaws.com/core-service/orders/finish-delivery'

  finishTheDelivery() {
    const orderId = Number(localStorage.getItem('orderId'));
    const url = this.finishTheOrderUrl + `?orderId=${orderId}`;
    this.http.put(url, null).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      }
    })
  }

  checkDeliveryFinished() {
    return this.data.deliveryStartedAt && !this.data.deliveryFinishedAt;
  }
}
