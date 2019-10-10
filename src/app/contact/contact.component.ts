import { Component } from '@angular/core';

import { routerTransition } from '../_lib/router.animations'

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [routerTransition()],
  host: {'[@routerTransition]': ''}
})
export class ContactComponent {

}
