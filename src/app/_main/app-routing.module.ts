import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { PublicComponent } from '../public/public.component';
import { ContactComponent } from '../contact/contact.component';
import { PrivateComponent } from '../private/private.component';
import { UserComponent } from '../user/user.component';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { ClientComponent } from '../client/client.component';

const routes: Routes = [
  { path: '', redirectTo: '/acceuil', pathMatch: 'full' },
  { path: 'acceuil', component: HomeComponent, data: { title: 'Acceuil' } },
  { path: 'public', component: PublicComponent, data: { title: 'Public' } },
  { path: 'contact', component: ContactComponent, data: { title: 'Contact' } },
  { path: 'private', component: PrivateComponent, data: { title: 'Private' } },
  { path: 'user', component: UserComponent, data: { title: 'User' } },
  { path: 'client', component: ClientComponent, data: { title: 'Client' } },
  { path: 'login', component: LoginComponent, data: { title: 'Login' } },
  { path: 'logout', component: LogoutComponent, data: { title: 'Logout' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
