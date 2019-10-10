import { Component } from '@angular/core';

import { routerTransition } from '../_lib/router.animations'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routerTransition()],
  host: { '[@routerTransition]': '' }
})
export class HomeComponent {

}
