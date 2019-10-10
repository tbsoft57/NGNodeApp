import { baseModel } from '../_lib/baseModel';

export class User extends baseModel<User> {

  constructor() { super(); this.keys = Object.keys(this);  this.me = this; }

  login: string = '';
  pass: string = '';
  name: string = '';

}
