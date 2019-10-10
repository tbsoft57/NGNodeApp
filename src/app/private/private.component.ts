import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { routerTransition } from '../_lib/router.animations';
import { Message } from '../_lib/message';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
  animations: [routerTransition()],
  host: { '[@routerTransition]': '' }
})
export class PrivateComponent {
  public message: string;

  constructor(public http: HttpClient) {
    this.http.get<Message>('privateTest').subscribe(
      Message => { this.message = Message.text; },
      HttpErrorResponse => { this.message = HttpErrorResponse.error.message; }
    );
  }

}
