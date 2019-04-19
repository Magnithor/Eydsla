import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum MessageType {
  sync,
  travel,
  setting,
  authenticate
}
export interface MessageTypeObject {
  type: MessageType;
}
export interface MessageTypeSync extends MessageTypeObject {
  type: MessageType.sync;
}
export interface MessageTravel extends MessageTypeObject {
  type: MessageType.travel;
  id: string;
}
export interface MessageSetting extends MessageTypeObject {
  type: MessageType.setting;
  key: string;
  value: any;
}
export interface MessageAuthenticate extends MessageTypeObject {
  type: MessageType.authenticate;
}
export type Message = MessageTypeSync | MessageTravel | MessageSetting | MessageAuthenticate;

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
