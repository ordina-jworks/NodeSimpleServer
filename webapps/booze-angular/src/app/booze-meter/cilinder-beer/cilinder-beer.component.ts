import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';

@Component({
  selector: '[app-cilinder-beer]',
  templateUrl: './cilinder-beer.component.html',
  styleUrls: ['./cilinder-beer.component.scss']
})
export class CilinderBeerComponent implements OnInit {
  private beerlevel = 100;
  private fullHeight = 558;
  private subject = new Subject();

  constructor(private socket: Socket) { }

  ngOnInit() {
    this.socket.connect();
    this.socket.on('app-event', (message) => {
      const data = JSON.parse(message);
      switch (data.level) {
        case 'FULL':
          this.subject.next(100);
          break;
        case 'HIGH':
          this.subject.next(75);
          break;
        case 'MEDIUM':
          this.subject.next(50);
          break;
        case 'LOW':
          this.subject.next(25);
          break;
        case 'EMPTY':
          this.subject.next(0);
          break;
        default:
          if (data.level && data.level >= 0 && data.level <= 100) {
            this.subject.next(data.level);
          }
      }
    });

    this.subject.subscribe((level: number) => {
      this.beerlevel = level;
    });
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
