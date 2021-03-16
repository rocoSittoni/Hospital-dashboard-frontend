import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/models/user.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public user: User;
  public imageToUpload: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private fileUploadService: FileUploadService) {

    this.user = userService.user;            
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [ this.user.name, Validators.required],
      email: [ this.user.email, [Validators.required, Validators.email]]
    });
  }

  updateProfile(){
    this.userService.updateProfile(this.profileForm.value)
        .subscribe( () => {
          const {name, email} = this.profileForm.value
          this.user.name = name;
          this.user.email = email;

          Swal.fire('Saved', 'Changes saved', 'success');
        }, (err) => {
          Swal.fire("Error", err.error.msg, 'error');
        });
  }

  changeImage(file: File){
    
    this.imageToUpload = file; 
    
    if( !file ){ 
      return this.imgTemp = null; 
    }
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = () => {
      this.imgTemp = reader.result;
      console.log(reader.result);
    }
  }

  uploadImage(){
    this.fileUploadService
        .updatePicture( this.imageToUpload, 'users', this.user.uid)
        .then( img => {
          this.user.img = img;
          Swal.fire('Saved', 'Image updated', 'success')
          .catch( err => {
          Swal.fire("Error", "Can't upload image", 'error');            
          });
        });
  }

}
