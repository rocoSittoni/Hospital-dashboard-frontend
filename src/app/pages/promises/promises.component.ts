import { Component, OnInit } from '@angular/core';
//import { resolve } from 'dns';
// import { rejects } from 'assert';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: [
  ]
})
export class PromisesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    })
    // const promise = new Promise( (resolve, reject) => {
    //   if( false ) {
    //     resolve('hola mundo');
    //   } else {
    //     reject('algo salio mal');
    //   }
    // });
    // promise.then( (mensaje) => {
    //   console.log('mensaje');
    // })
    // .catch( error => console.log('errorrr', error))
    // console.log('fin del InIt');
  }

  getUsuarios() {

    const promise = new Promise( resolve => {
      fetch('https://reqres.in/api/users')
      .then( resp => resp.json())
      .then( body => resolve( body.data ));
    });

    return promise;

  }

}
