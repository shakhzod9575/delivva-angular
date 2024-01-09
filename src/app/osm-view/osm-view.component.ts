import { Component, OnInit } from '@angular/core';
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
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-osm-view',
  templateUrl: './osm-view.component.html',
  styleUrls: ['./osm-view.component.css']
})
export class OsmViewComponent implements OnInit{

  public map!: Map
  public searchQueryFrom = '';
  public searchQueryTo = '';
  private count = 0;
  isFromValid: boolean = false;
  isToValid: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
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
      zoom: 2,maxZoom: 18, 
    }),
  });

  this.map.on('click', (event) => {
    const [longitude, latitude] = event.coordinate;
    console.log('Longitude: ' + longitude + ', Latitude: ' + latitude);
  });
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
    if(this.count % 2 === 0) {
      src = '../../assets/images/blue-marker.svg';
      color = 'blue';
    } else {
      src = '../../assets/images/red-marker.svg'
      color = 'red';
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
  });

  let vectorLayer = this.map.getLayers().getArray().find((layer) => layer instanceof VectorLayer) as VectorLayer<VectorSource>;

  if (!vectorLayer) {
    vectorLayer = new VectorLayer<VectorSource>({
      source: new VectorSource({
        features: markers,
      }),
    });

    this.map.addLayer(vectorLayer);
  } else {
    const vectorSource = vectorLayer.getSource() as VectorSource;
    vectorSource.clear();
    vectorSource.addFeatures(markers);
  }
}

  checkAll() {
    return this.isFromValid && this.isToValid;
  }


  searchLocation() {
    const nominatimUrlFrom = `https://nominatim.openstreetmap.org/search?q=${this.searchQueryFrom}&format=json`;
    const nominatimUrlTo = `https://nominatim.openstreetmap.org/search?q=${this.searchQueryTo}&format=json`;

    axios.get(nominatimUrlFrom)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const result = response.data[0];
          const longitudeFrom = parseFloat(result.lon);
          const latitudeFrom = parseFloat(result.lat);

          axios.get(nominatimUrlTo)
            .then((response) => {
              if (response.data && response.data.length > 0) {
                const result = response.data[0];
                const longitudeTo = parseFloat(result.lon);
                const latitudeTo = parseFloat(result.lat);

                const fromCoordinates = fromLonLat([longitudeFrom, latitudeFrom]);
                const toCoordinates = fromLonLat([longitudeTo, latitudeTo]);

                const extent = [
                  Math.min(fromCoordinates[0], toCoordinates[0]),
                  Math.min(fromCoordinates[1], toCoordinates[1]),
                  Math.max(fromCoordinates[0], toCoordinates[0]),
                  Math.max(fromCoordinates[1], toCoordinates[1]),
                ];

                this.map.getView().fit(extent, { padding: [20, 20, 20, 20], duration: 1000 });
                
                this.addMarker([[longitudeFrom, latitudeFrom], [longitudeTo, latitudeTo]]);
                this.isFromValid = true;
                this.isToValid = true;
                localStorage.setItem('lonFrom', longitudeFrom.toString());
                localStorage.setItem('latFrom', latitudeFrom.toString());
                localStorage.setItem('lonTo', longitudeTo.toString());
                localStorage.setItem('latTo', latitudeTo.toString());
              } else {
                console.error('Location not found');
                this.isFromValid = false;
                this.isToValid = false;
              }
            })
        } else {
          console.error('Location not found');
          this.isFromValid = false;
          this.isToValid = false;
        }
      })
      .catch((error) => {
        console.error('Error during geocoding:', error);
      });
  }

  onSubmit() {
    this.router.navigateByUrl("/create-order/date");
  }
}
