import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  socket!: WebSocketSubject<any>

  openConnection(){
    this.socket = webSocket(environment.webSocket)
    return this.socket
  }

  sendData(data: any){
    if(this.socket){
      this.socket.next(data)
    }
  }
  
  closeConnection(){
    if(this.socket){
      this.socket.complete()
    }
  }
}
