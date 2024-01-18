
import { Map } from "ol";
import { Control } from "ol/control";

export class ArrowsControl extends Control {

    map!: Map;
    constructor(map: Map, speed: number) {  
        const km = Math.floor(Math.random() * (2000 - 500 + 1)) + 500;
        let arrowRight = document.createElement('button')
        arrowRight.innerHTML = `Car speed: ${speed} km/hr`
        arrowRight.style.fontWeight = 'bold'
        arrowRight.style.width = '170px'
        let distance = document.createElement('button');
        distance.innerHTML = `Distance between two points: ${km} km`;
        distance.style.marginLeft = '333px'
        distance.style.width = '300px'
        distance.style.fontWeight = 'bold'
        let elem = document.createElement('div')
        elem.style.marginTop = '350px'
        // elem.className = 'right ol-control'
        elem.append(arrowRight)
        elem.append(distance);

        super({
            element: elem
        })
        this.map = map
    }

    updateSpeedContent(speed: number) {
        const arrowRight = this.element.querySelector('button');
        if (arrowRight) {
          arrowRight.innerHTML = `Car speed: ${speed} km/hr`;
        }
      }
}