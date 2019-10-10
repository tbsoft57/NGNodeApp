import { baseModel } from '../_lib/baseModel';

export class Client extends baseModel<Client> {

  constructor() { super(); this.keys = Object.keys(this);  this.me = this; }

  nom: string = '';
  prenom: string = '';
  rue: string = '';
  cp: string = '';
  ville: string = '';
  prix: number = 0;
  email: string = '';
  actif: boolean = true;

}
