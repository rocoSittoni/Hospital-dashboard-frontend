import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy{

  intervalSubs: Subscription;

  constructor() {

    // this.returnObservable().pipe(
    //   retry(2)
    // ).subscribe(
    //   value => console.log('Subs:', value),
    //   error => console.warn('Error:', error),
    //   () => console.info('Obs terminado')
    // );

    this.intervalSubs = this.returnInterval().subscribe(console.log);

  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  returnInterval(): Observable<number>{

    return interval(100)
      .pipe(
        // take(10),
        map( valor => valor + 1),
        filter( valor => (valor % 2 === 0) ? true:false),
        );

  }

  returnObservable(): Observable<number> {

    let i = -1;  

    return new Observable<number>( observer => {

      const interval = setInterval( () => {

        i++;
        observer.next(i);

        if( i === 4 ) {
          clearInterval(interval);
          observer.complete();
        }

        if ( i === 2 ) {
        i = 0;
        observer.error('i finish to 2');
        }

      }, 1000)
    });



  }
}
