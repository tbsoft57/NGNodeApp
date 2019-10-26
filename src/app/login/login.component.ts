import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { routerTransition } from '../_lib/router.animations';
import { User } from '../_models/user';
import { LoginVm } from '../_lib/login.vm';
import { app } from '../_lib/app.instance';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [routerTransition()],
  host: { '[@routerTransition]': '' }
})
export class LoginComponent extends LoginVm {
  public status: string = '';

  constructor(public http: HttpClient) { super(); }

  async logIn() {
    this.http.post<User>('login', this).subscribe(
    User => { this.status = 'Loged In'; app.user = User; },
    HttpErrorResponse => { console.log(HttpErrorResponse); this.status = HttpErrorResponse.error.message; });
  }

  checkSSLlogin() {
    this.http.get<User>('checkSSLlogin').subscribe(
      User => { this.status = 'Loged In'; app.user = User; },
      HttpErrorResponse => { console.log(HttpErrorResponse); this.status = HttpErrorResponse.error.message; });
  }
}
