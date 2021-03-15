import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit{

  public formSubmited = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor( private router: Router,
               private fb: FormBuilder,
               private userService: UserService) { }

  ngOnInit(): void{
    this.renderButton();
  }               

  login() {

    this.userService.login(this.loginForm.value)
        .subscribe(resp => {
          if(this.loginForm.get('remember').value){
            localStorage.setItem('email', this.loginForm.get('email').value)
          } else {
            localStorage.removeItem('email');
          }
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        })
    
    // console.log(this.loginForm.value)
    // this.router.navigateByUrl('/');
    
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark'
    });
    this.startApp();
  }

  startApp() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '921151006999-sb1a0d3f79hb1cei5ve25bhvh8dtfdl7.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
      });
      this.attachSignin(document.getElementById('my-signin2'));
    });
  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          this.userService.loginGoogle(id_token).subscribe();
        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
