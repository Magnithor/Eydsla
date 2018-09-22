import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum MessageType {
  sync,
  travel
}

export interface Message {
  type:MessageType,
  id?:string
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private subject = new Subject<Message>();
  sendMessage(message: Message) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<Message> {
    return this.subject.asObservable();
  }
}
