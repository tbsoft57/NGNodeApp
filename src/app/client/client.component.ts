import { Component } from '@angular/core';

import { routerTransition } from '../_lib/router.animations'
import { ClientService } from '../_services/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations: [routerTransition()],
  host: { '[@routerTransition]': '' }
})
export class ClientComponent {

  constructor(public client: ClientService) { }

  postTest() {
    this.client.prenom = 'Test';
    this.client.post();
  }
}
