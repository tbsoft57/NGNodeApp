import {trigger, state, animate, style, transition} from '@angular/animations';

export function routerTransition() {
  return slideToRight();
}

export function slideToRight() {
  return trigger('routerTransition', [
    state('*', style({ position:'initial', width: 'initial', zIndex: 'initial',transform: 'initial'}) ),
    transition('void => *', [
      style({ position:'fixed', width: '100%', zIndex: '-1', transform: 'translateX(-100%)' }),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition('* => void', [
      style({ position:'fixed', width: '100%', transform: 'translateX(0)' }),
      animate('0.5s ease-in-out', style({transform: 'translateX(100%)'}))
    ])
  ]);
}

/// Reprendre l'idée ci-dessus pour les suivants ( sinon il manque y scrollBar)
export function slideToLeft() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%'}) ),
    state('*', style({position:'fixed', width:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);
}

export function slideToBottom() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%', height:'100%'}) ),
    state('*', style({position:'fixed', width:'100%', height:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateY(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(100%)'}))
    ])
  ]);
}

export function slideToTop() {
  return trigger('routerTransition', [
    state('void', style({position:'fixed', width:'100%', height:'100%'}) ),
    state('*', style({position:'fixed', width:'100%', height:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateY(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
    ])
  ]);
}