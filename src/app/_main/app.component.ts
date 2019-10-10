import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter, map, mergeMap } from 'rxjs/operators';

import { LoginComponent } from '../login/login.component';
import { app } from '../_lib/app.instance';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public app = app;
  constructor( private router: Router, private http: HttpClient, private titleService: Title, private activatedRoute: ActivatedRoute) {
    const log = new LoginComponent(http);
    if (environment.production) { log.checkSSLlogin();
    } else {
      log.login = window.localStorage.getItem('login');
      log.pass = window.localStorage.getItem('pass');
      if (log.login && log.pass) log.logIn();
    }
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route: any) => route.data)
      )
      .subscribe((event) => {
        app.pageTitle = app.name + ' - ' + event['title'];
        this.titleService.setTitle(app.pageTitle);
      });
  }
}
