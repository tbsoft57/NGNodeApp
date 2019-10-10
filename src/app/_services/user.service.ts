import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService extends User {
  public apiUrl: string = 'user';

  constructor(public http: HttpClient) { super(); }

}
