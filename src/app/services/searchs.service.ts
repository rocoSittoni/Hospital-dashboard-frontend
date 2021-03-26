import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Doctor } from '../models/doctor.model';
import { Hospital } from '../models/hospital.model';
import { User } from '../models/user.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SearchsService {

  constructor( private http: HttpClient) { }

  get token(): string{
    return  localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformUsers(results: any[]):User[]{
    return results.map(
      user => new User( user.name, user.email, user.password, user.img, user.google, user.uid )
    );
  }

  private transforHospitals(results: any[]):Hospital[]{
    return results;
  }

  private transformDoctors(results: any[]):Doctor[]{
    return results;
  }

  search( type: 'users'|'doctors'|'hospitals',
          term: string ) {
    
    const url = `${base_url}/all/collection/${type}/${term}`;
    return this.http.get<any[]>( url, this.headers )
            .pipe(
              map( (resp: any) => {
                
                switch(type){
                  case 'users':
                    return this.transformUsers(resp.results)
                  case 'hospitals':
                    return this.transforHospitals(resp.results)
                  case 'doctors':
                    return this.transformDoctors(resp.results)  
                  default:
                    return [];  
                }
              })
            );
  }

}
