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
import { OrderService } from '../services/order/order.service';
import { HttpClient } from '@angular/common/http';
import LineString from 'ol/geom/LineString';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css']
})
export class MyOrderComponent implements OnInit {

  public map!: Map
  private count = 0;
  data!: Order;
  username!: string;
  currentUserId!: number;

  constructor(
    private orderService: OrderService, 
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private matRef: MatDialog
  ) {
    this.currentUserId = Number(localStorage.getItem('userId'));
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
      [Number(order.finalDestination.longitude), Number(order.finalDestination.latitude)],
      [30.5234, 50.4501]
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

    const routeCoordinatesFrom = coordinatesArray[0];
    const routeCoordinatesTo = [30.5234, 50.4501]; 

    this.count = 0;

    let vectorLayer = this.map.getLayers().getArray().find((layer) => layer instanceof VectorLayer) as VectorLayer<VectorSource>;

    vectorLayer = new VectorLayer<VectorSource>({
      source: new VectorSource({
        features: markers,
      }),
    });

    this.map.addLayer(vectorLayer);

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62487dc5a35097cb461f9671bec1d23408fe&start=${routeCoordinatesFrom[0]},${routeCoordinatesFrom[1]}&end=${routeCoordinatesTo[0]},${routeCoordinatesTo[1]}`;
    this.http.get(url).subscribe({
      next: (routeData: any) => {
        const coordinates = routeData.features[0].geometry.coordinates;
        const route = new LineString(coordinates).transform('EPSG:4326', 'EPSG:3857');
        const feature = new Feature(route);
        const vectorSource = vectorLayer!.getSource();
        if(vectorSource != null) {
          vectorSource.addFeature(feature);
        }
      },
      error: (error) => {
        console.error('Error fetching route:', error);
      }
    }
    );
  }

  private cancelOrderUrl = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/orders/cancel';

  cancelAnOrder() {
    const cancelOrder = {
      userId: Number(localStorage.getItem('userId')),
      orderId: Number(localStorage.getItem('orderId'))
    };
    this.http.post(this.cancelOrderUrl, cancelOrder).subscribe({
      next: () => {
        this.toastr.success("Order is cancelled successfully!!!");
      },
      error: (error: any) => {
        if(error.status === 400) {
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

  statusChangeUrl: string = 'http://Delivva-core-env.eba-n3sj6avt.eu-north-1.elasticbeanstalk.com/api/v1/orders/status';

  approveDelivery() {
    const orderId = Number(localStorage.getItem('orderId'));
    const status = 'DONE';
    const statusChangeData = {
      id: orderId,
      status: status
    };
    this.http.put(this.statusChangeUrl, statusChangeData).subscribe({
      next: () => {
        this.toastr.info("Dispute status is changed to Done!!!");
      }
    })
  }

}
