import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppService {
  public socket: io.Socket;

  constructor(public httpClient: HttpClient) {
  }

  public openSocket(): Observable<any> {
    let location;
    let port = window.location.port;

    port = port === '' ? '' : ':' + 8000;
    if (port === '') {
      location = window.location.hostname.replace('-http-', '-ws-');
    } else {
      location = window.location.hostname;
    }

    const url = 'http://' + location + port + '/socket';
    this.socket = io(url);


    const observable = new Observable(observer => {
      this.socket.on('app-event', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}
