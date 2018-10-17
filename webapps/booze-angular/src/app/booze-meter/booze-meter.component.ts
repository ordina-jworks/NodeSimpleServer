import { Component, OnInit } from '@angular/core';
import { beerAnimation } from '../animations/beer.animation';

@Component({
  selector: 'app-booze-meter',
  templateUrl: './booze-meter.component.html',
  styleUrls: ['./booze-meter.component.scss'],
  animations: [
    beerAnimation,
  ]
})
export class BoozeMeterComponent implements OnInit {

  beerAnimation = 'in';

  ngOnInit() {
    this.toggleBeerAnimation();
  }

  toggleBeerAnimation() {
    this.beerAnimation = this.beerAnimation === 'in' ? 'out' : 'in';
  }
}
