import { baseModel } from './baseModel';

export class Message extends baseModel<Message> {
  constructor() { super(); this.keys = Object.keys(this);  this.me = this;}

  text: string = '';

}
