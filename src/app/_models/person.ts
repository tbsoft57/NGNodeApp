import { baseModel } from '../_lib/baseModel';

export class Person extends baseModel<Person> {

  constructor() { super(); this.keys = Object.keys(this); this.me = this; }

  firstName: string = '';
  lastName: string = '';
  age: number = 0;

}
