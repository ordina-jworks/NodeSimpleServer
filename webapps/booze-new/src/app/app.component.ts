import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private connection;
  private data;
  @ViewChild('rect4384') rectangle: ElementRef;

  constructor(public appService: AppService) {
  }

  ngOnInit() {
    this.connection = this.appService.openSocket().subscribe((dataSocket) => {
      const data = JSON.parse(dataSocket);
      switch (data.level) {
        case 'FULL' :
          this.data = 100;
          console.log('100');
          break;
        case 'HIGH' :
          this.data = 75;
          console.log('75');
          break;
        case 'MEDIUM' :
          this.data = 50;
          console.log('50');
          break;
        case 'LOW' :
          this.data = 25;
          console.log('25');
          break;
        case 'EMPTY' :
          this.data = 0;
          console.log('0');
          break;
        default :
          /*if (data.level && data.level >= 0 && data.level <= 100) {
            callbacks[i](data.level);
          }*/
          this.data = data.level;
          break;
      }
      this.editViewChild();
    });
  }

  private editViewChild() {
    this.rectangle.nativeElement.setAttribute('d', this.composePath(this.data * (558 / 100)));
  }

  private composePath(data) {
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
      'l ' + topLeftX + ',-' + (topLeftY + data) + ' ' +
      'c -' + bezierPoint1X + ',-' + bezierPoint1Y + ' ' +
      '-' + bezierPoint2X + ',-' + bezierPoint2Y + ' ' +
      '-' + topRightX + ',' + topRightY + ' z'
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }
}
