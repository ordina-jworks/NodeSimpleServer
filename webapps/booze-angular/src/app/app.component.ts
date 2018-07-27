import { Component, OnInit } from '@angular/core';
import { glassMovement } from './animations/glass.animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    glassMovement,
  ]
})
export class AppComponent implements OnInit {
  title = 'app';
  glassState = 'in';

  ngOnInit() {
    this.toggleGlassState();
  }

  toggleGlassState() {
    this.glassState = this.glassState === 'in' ? 'out' : 'in';
  }

  onDoneGlassState($event) {
    this.toggleGlassState();
  }
}
