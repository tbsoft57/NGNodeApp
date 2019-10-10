import { baseModel } from './baseModel';

export class LoginVm extends baseModel<LoginVm> {

  constructor() { super(); this.keys = Object.keys(this);  this.me = this; }

  login: string = '';
  pass: string = '';

}
