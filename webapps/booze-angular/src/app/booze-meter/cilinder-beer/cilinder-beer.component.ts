import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: '[app-cilinder-beer]',
  templateUrl: './cilinder-beer.component.html',
  styleUrls: ['./cilinder-beer.component.scss']
})
export class CilinderBeerComponent implements OnInit {
  private beerlevel = 100;
  private fullHeight = 558;
  private observableSocket;
  constructor(private socket: Socket) { }

  ngOnInit() {
    this.socket.connect();
    this.socket.on('app-event', (_) => {
      console.log(_);
    });
   /*  this.observableSocket = this.stompService.subscribe('/welcome');
    //this.observableSocket.map((message) => {
    //  console.log(message);
    //}); */
  }

  animateBeer(level: number) {
    this.beerlevel = level;
  }

  calculateAndDrawNewBeerShape(level: number) {
    level = (level * (this.fullHeight / 100));
    const topLeftX = 0,
      topLeftY = 0,
      topRightX = 78,
      topRightY = 0,
      bezierPoint1X = 10,
      bezierPoint1Y = 15,
      bezierPoint2X = 76,
      bezierPoint2Y = 11;

    return 'm 281,73 0,558.436651 ' +
      'c 10,15 ' +
      '76,11 ' +
      '78,0 ' +
      'l ' + topLeftX + ',-' + (topLeftY + level) + ' ' +
      'c -' + bezierPoint1X + ',-' + bezierPoint1Y + ' ' +
      '-' + bezierPoint2X + ',-' + bezierPoint2Y + ' ' +
      '-' + topRightX + ',' + topRightY + ' z'
  }
}
