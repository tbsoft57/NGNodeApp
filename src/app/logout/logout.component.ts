import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { routerTransition } from '../_lib/router.animations'
import { Message } from '../_lib/message';
import { app } from '../_lib/app.instance';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  animations: [routerTransition()],
  host: { '[@routerTransition]': '' }
})
export class LogoutComponent {
  public status: string = '';

  constructor(public http: HttpClient) { }

  logOut() { this.http.post<Message>('logout', null).subscribe(
    Message => { this.status = Message.text; app.user = null; },
    HttpErrorResponse => { this.status = HttpErrorResponse.error.message; });
  }
}
