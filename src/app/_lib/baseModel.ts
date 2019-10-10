import { HttpClient } from '@angular/common/http';

import { Message } from './message';

export class baseModel<T> {
  me: T;
  apiUrl: string;
  http: HttpClient;
  all: Array<T>;
  keys: Array<string>;
  id: number = 0;
  version: number = 0;

  map(data) { this.keys.forEach(key => this[key] = data[key]); }

  toJSON() {
    const tmp = Object.create(this);
    this.keys.forEach(key => tmp[key] = this[key]);
    return tmp;
  }

  getById(id: number) { this.http.get<T>(this.apiUrl + '/' + id.toString()).subscribe(
    HttpBody => { this.map(HttpBody); },
    HttpErrorResponse => { console.log(HttpErrorResponse); });
  }

  getAll() { this.http.get<Array<T>>(this.apiUrl + '/All').subscribe(
    HttpBody => { this.all = HttpBody; },
    HttpErrorResponse => { console.log(HttpErrorResponse); });
  }

  post() {this.http.post<Message>(this.apiUrl + '/' + this.me['id'], this.me).subscribe(
    HttpBody => { console.log(HttpBody); },
    HttpErrorResponse => { console.log(HttpErrorResponse); });
  }

  put() {this.http.put<Message>(this.apiUrl + '/0', this.me).subscribe(
    HttpBody => { console.log(HttpBody); },
    HttpErrorResponse => { console.log(HttpErrorResponse); });
  }

  delete(id: number) {this.http.delete<Message>(this.apiUrl + '/' + id.toString()).subscribe(
    HttpBody => { console.log(HttpBody); },
    HttpErrorResponse => { console.log(HttpErrorResponse); });
  }
}
