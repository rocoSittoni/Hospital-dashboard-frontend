import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { LoadUser } from '../interfaces/load-users.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interfaces';
import { User } from '../models/user.model';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public auth2: any;
  public user: User;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {

    this.googleInIt();            
  }

  get token(): string{
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.user.role;
  }

  get uid():string{
    return this.user.uid || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInIt(){

    return new Promise<void>(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '921151006999-sb1a0d3f79hb1cei5ve25bhvh8dtfdl7.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })
  }

  saveLocalStorage(token:string , menu:any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu) ); 
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validateToken(): Observable<boolean> {
    
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        console.log(resp);
        const { email, google, name, role, img='', uid } = resp.user;
        this.user = new User(name, email, '', img, google, role, uid );
        this.saveLocalStorage(resp.token, resp.menu);  
        return true;
      }),
      catchError( error => of(false))
    );
  }

  createUser(formData: RegisterForm){
    return this.http.post(`${base_url}/users`, formData)
    .pipe(
      tap( (resp: any) => {
        this.saveLocalStorage(resp.token, resp.menu);
      })
    )
  }

  updateProfile( data: { email:string, name:string, role: string } ){
    data = {
      ...data,
      role: this.user.role
    }
    return this.http.put(`${base_url}/users/${this.uid}`, data, this.headers);
  }

  login(formData: LoginForm){
    return this.http.post(`${base_url}/login`, formData)
    .pipe(
      tap( (resp: any) => {
        this.saveLocalStorage(resp.token, resp.menu);
      })
    )
  }

  loginGoogle(token){
    return this.http.post(`${base_url}/login/google`, {token})
    .pipe(
      tap( (resp: any) => {
        this.saveLocalStorage(resp.token, resp.menu);
      })
    )
  }

  loadUsers(from: number = 0 ){
    const url = `${base_url}/users?from=${from}`
    return this.http.get<LoadUser>( url, this.headers )
          .pipe(
            map( resp => {
                const users = resp.users.map( 
                  user => new User( user.name, user.email, user.password, user.img, user.google,user.role, user.uid ));
                  return {
                    total: resp.total,
                    users
                };
              })
            )
  }

  deleteUser(user: User){
    console.log(user);
    const url = `${base_url}/users/${user.uid}`;
    return this.http.delete( url, this.headers );
    // TO DO: check error at delete user from maintenance (requests doesnt fuckin work)
  }

  saveUser( user: User){
    // TO DO: check error at change user role from maintenance (requests doesnt fuckin work)
    return this.http.put(`${base_url}/users/${user.uid}`, user, this.headers);
  }

}
