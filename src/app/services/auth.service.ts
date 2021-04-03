import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { meData } from '../operations/query';
import { MeData } from '../components/me/me.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessVar = new Subject<boolean>();
  public accessVar$ = this.accessVar.asObservable();
  public userVar = new Subject<MeData>();
  public userVar$ = this.userVar.asObservable();

  constructor(private apollo: Apollo, private router: Router) {}

  public updateStateSession(newValue: boolean): void {
    this.accessVar.next(newValue);
  }

  public updateUser(newValue: MeData): void {
    this.userVar.next(newValue);
  }

  logout(): void {
    this.updateStateSession(false);
    localStorage.removeItem('tokenJWT');

    const currentRouter = this.router.url;
    if (currentRouter !== '/register' && currentRouter !== '/users') {
      this.router.navigate(['/login']);
    }
  }

  private sincroValues(result: MeData, state: boolean): void {
    this.updateStateSession(state);
    this.updateUser(result);
  }

  start(): void {
    if (localStorage.getItem('tokenJWT') !== null) {
      this.getMe().subscribe((result: MeData) => {
        if (result.status) {
          if (this.router.url === '/login') {
            this.sincroValues(result, true);
            this.router.navigate(['/me']);
          }
        }
        this.sincroValues(result, result.status);
      });
    } else {
      // no hay token
      this.sincroValues(null, false);
    }
  }

  // Obtener nuestro usuario y datos con el token
  getMe(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: meData,
        fetchPolicy: 'network-only',
        context: {
          headers: new HttpHeaders({
            authorization: localStorage.getItem('tokenJWT'),
          }),
        },
      })
      .valueChanges.pipe(map((result: any) => result.data.me));
  }
}
