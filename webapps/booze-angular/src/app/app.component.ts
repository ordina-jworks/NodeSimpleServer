import { Component, OnInit } from '@angular/core';
import { fillGlassWithBeer, glassMovement } from './animations/glass.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    glassMovement,
    fillGlassWithBeer,
  ]
})
export class AppComponent implements OnInit {
  title = 'app';
  glassState = 'in';
  beerState = 'empty';

  ngOnInit() {
    this.toggleGlassState();
  }

  toggleGlassState() {
    this.glassState = this.glassState === 'in' ? 'out' : 'in';
  }

  toggleBeerState() {
    this.beerState = this.beerState === 'empty' ? 'full' : 'empty';
  }

  onDoneGlassState($event) {
    this.toggleGlassState();
  }

  onDoneBeerState($event) {
    this.toggleBeerState();
  }
}
