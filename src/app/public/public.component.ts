import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { routerTransition } from '../_lib/router.animations';
import { Message } from '../_lib/message';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
  animations: [routerTransition()],
  host: { '[@routerTransition]': '' }
})
export class PublicComponent {
  public message: string;

  constructor(public http: HttpClient) {
    this.http.get<Message>('publicTest').subscribe(
      Message => { this.message = Message.text; },
      HttpErrorResponse => { this.message = HttpErrorResponse.error.message; }
    );
  }

}
