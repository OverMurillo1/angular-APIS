import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Auth } from './../models/auth.model';
import { User } from './../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //       Authorization: `Bearer ${token}`,
  //       'Content-type': 'application/json'
  //     }
  //   });
  // }
  profile(token: string) {
    throw new Error('Method not implemented.');
  }

  private apiURL = `${environment.api_url}/api/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(email: string, password:string){
    return this.http.post<Auth>(`${this.apiURL}/login`, {email,password})
    .pipe(
      tap( response => this.tokenService.saveToken(response.access_token))
    );
  }

  // profile(token: string){
  //   // const headers = new HttpHeaders();
  //   // headers.set('Authorization', `Bearer ${token}`)
  //   return this.http.get<User>(`${this.apiURL}/profile`,{
  //     headers:{
  //       Authorization: `Bearer ${token}`,
  //       'Content-type': 'application/json'
  //     }
  //   });
  // }

  getProfile() {
    // const headers = new HttpHeaders();
    // headers.set('Authorization',  `Bearer ${token}`);
    return this.http.get<User>(`${this.apiURL}/profile`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   'Content-type': 'application/json'
      // }
    });
  }

  loginAndGet(email: string, password: string) {
    return this.login(email, password)
    .pipe(
      switchMap( () => this.getProfile() ),
    )
  }
}
