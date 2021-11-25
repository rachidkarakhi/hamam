import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  connect(auth:any){
    return this.http.post<User>("https://elfadel.hamam.ma/wp-json/jwt-auth/v1/token", auth);
  }
  getuser(mail:string){
    return this.http.get<any>("https://elfadel.hamam.ma/wp-json/wp/v2/users/?search="+ mail);
  }
  getusers(){
    return this.http.get<any>("https://elfadel.hamam.ma/wp-json/wp/v2/users");
  }
}
