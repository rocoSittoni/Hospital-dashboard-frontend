import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { SearchsService } from 'src/app/services/searchs.service';
import { UserService } from 'src/app/services/user.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { User } from '../../../models/user.model';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit, OnDestroy {

  public totalUsers: number = 0;
  public users: User[] = [];
  public usersTemp: User[] = [];
  public imgSubs: Subscription;
  public from: number = 0;
  public loading: boolean = true;

  constructor( private userService: UserService,
               private searchsService: SearchsService,
               private modalImageService: ModalImageService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.imgSubs = this.modalImageService.newImage
      .pipe(delay(100))
      .subscribe( img => this.loadUsers() );
  }

  loadUsers(){
    this.loading = true;
    this.userService.loadUsers(this.from)
      .subscribe( ({ total, users }) => {
          this.totalUsers = total;
          this.users = users;
          this.usersTemp = users;
          this.loading = false;
      });
  }

  changePage(value: number){
    this.from += value;

    if(this.from < 0){
      this.from = 0;
    } else if (this.from >= this.totalUsers){
      this.from -= value;
    }
    this.loadUsers();
  }

  search(term: string){
    if(term.length === 0){
      return this.users = this.usersTemp;
    }
    this.searchsService.search('users', term)
        .subscribe( (resp: User[]) => {
          this.users = resp;
        });
  }

  deleteUser(user: User){
    console.log(user);
    if(user.uid === this.userService.uid){
      return Swal.fire('Error', 'cant delete yourself', 'error');
    }
    Swal.fire({
      title: 'sure you want to delete user?',
      text: `you are about to delete ${user.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(user)
            .subscribe( resp => {
              this.loadUsers();
              Swal.fire(
                'User deleted', 
                `${user.name} was correctly deleted`, 
                'success'
              );
            });
      }
    })
  }

  changeRole(user: User){
    this.userService.saveUser(user)
        .subscribe(resp => {
          console.log(resp);
        })
  }

  openModal(user: User){
    console.log(user);
    this.modalImageService.openModal('users', user.uid, user.img);
  }


}
