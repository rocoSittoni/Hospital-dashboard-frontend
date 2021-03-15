import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  public formSubmited = false;

  public registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password2: ['', Validators.required],
    terms: [false, Validators.required],
  }, {
    validators: this.samePasswords('password', 'password2')
  });

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router) { }

  createUser(){
    
    this.formSubmited = true
    console.log(this.registerForm.value);
    
    if(this.registerForm.invalid){
      return;
    } 
    this.userService.createUser(this.registerForm.value)
        .subscribe( resp => {
          this.router.navigateByUrl('/');
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });

  }

  invalidField(field: string): boolean {
    
    if( this.registerForm.get(field).invalid && this.formSubmited){
      return true;
    } else {
      return false;
    }
  }

  invalidPasswords(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;
  
    if( (pass1 !== pass2 && this.formSubmited) ){
      return true;
    } else {
      return false;
    }

  }

  termsAgree(){
    return !this.registerForm.get('terms').value && this.formSubmited;
  }

  samePasswords( pass1name: string, pass2name: string ){
    return (formGroup: FormGroup ) => {
      const pass1control = formGroup.get(pass1name);
      const pass2control = formGroup.get(pass2name);

      if(pass1control.value === pass2control.value){
        pass2control.setErrors(null)
      } else {
        pass2control.setErrors({ notSame: true })
      }


    }
  }

}