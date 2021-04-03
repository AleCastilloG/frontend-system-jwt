import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { getUsers, login } from '../operations/query';
import { RegisterData } from '../components/register/register.interface';
import { registerData } from '../operations/mutation';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private readonly apollo: Apollo) {}

  getUsers(): Observable<any> {
    return this.apollo
      .watchQuery({
        query: getUsers,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(map((result: any) => result.data.users));
  }

  login(email: string, password: string): Observable<any> {
    // return this.apollo.query
    return this.apollo
      .watchQuery({
        query: login,
        variables: { email, password },
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((result: any, loding: any) => {
          return result.data.login;
        })
      );
  }

  register(user: RegisterData): Observable<any> {
    return this.apollo.mutate({
      mutation: registerData,
      variables: {
        user,
      },
    });
  }
}
