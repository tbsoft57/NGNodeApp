import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Client } from '../_models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService extends Client {
  public apiUrl: string = 'client';

  constructor(public http: HttpClient) { super(); }

}
