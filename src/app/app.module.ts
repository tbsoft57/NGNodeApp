import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './_main/app-routing.module';
import { MaterialModule } from './_lib/material.module';
import { ApiInterceptor } from './_lib/api.interceptor';
import { AppComponent } from './_main/app.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PublicComponent } from './public/public.component';
import { PrivateComponent } from './private/private.component';
import { UserComponent } from './user/user.component';
import { ClientComponent } from './client/client.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ContactComponent,
    LoginComponent,
    LogoutComponent,
    PublicComponent,
    PrivateComponent,
    UserComponent,
    ClientComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: environment.appName }),
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({ cookieName: 'XSRF-COOKIE', headerName: 'X-XSRF-TOKEN' }),
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: object, @Inject(APP_ID) private appId: string) {
    console.log(`App Running with platformId=${platformId} appId=${appId} production: ${environment.production}`);
  }
}
