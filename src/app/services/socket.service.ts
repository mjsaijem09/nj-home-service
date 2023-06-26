import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { CHATROOM } from '../shared/url';
import {  } from './api-services.service';
@Injectable({
providedIn: 'root'
})
export class SocketService {
private socket:Socket;

constructor() { 
  this.socket = io(environment.socket_url);  
}
emit(event:string, data:any){
  this.socket.emit(event,data);
}
on(event:string){
  return Observable.create((observer:any)=>{
   this.socket.on(event,(data:any)=>{
    observer.next(data);
   });
  })
 }

  joinRoom(data) {
    console.log(data);
    this.socket.emit('join', data);
  }

  sendMessage(data) {
    console.log(data);
    let test = this.socket.emit('message', data);
    console.log("test if emitted",test);
  }

  getAllMessage(data) {
    this.socket.emit('get-messages', data)
  }

  newMessageReceived() {
    const observable = new Observable<{
      roomId: String,
      message: String,
      messageType: String,
      media: Array<String>,
      files: Array<String>,
      sendStatus: String,
      senderId: String,
      recipientId: String,
      sentBy: String
    }>(observer => {
      this.socket.on('new message', (data) => {
        console.log(data);        
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  typing(data) {
    this.socket.emit('typing', data);
  }

  receivedTyping() {
    const observable = new Observable<{ type : String, roomId: String, typing: boolean}>(observer => {
      this.socket.on('typing', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}