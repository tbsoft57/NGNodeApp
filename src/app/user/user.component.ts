import { Component } from '@angular/core';

import { routerTransition } from '../_lib/router.animations'
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  animations: [routerTransition()],
  host: { '[@routerTransition]': '' }
})
export class UserComponent {

  constructor(public user: UserService) { }

}
