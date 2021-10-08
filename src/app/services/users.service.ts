import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { User, CreateUsertDTO } from './../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiURL = `${environment.api_url}/api/users`;

  constructor(
    private http: HttpClient
  ) { }

  create(dto: CreateUsertDTO){
    return this.http.post<User>(this.apiURL, dto);
  }

  getAll(dto: CreateUsertDTO){
    return this.http.get<User[]>(this.apiURL);
  }
}
