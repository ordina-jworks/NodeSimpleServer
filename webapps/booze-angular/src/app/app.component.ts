import { Component, OnInit } from '@angular/core';
import { beerAnimation } from './animations/beer.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    beerAnimation,
  ]
})
export class AppComponent implements OnInit {
  title = 'app';
  beerAnimation = 'in';

  ngOnInit() {
    this.toggleBeerAnimation();
  }

  toggleBeerAnimation() {
    this.beerAnimation = this.beerAnimation === 'in' ? 'out' : 'in';
  }
}
