import { Component, OnInit } from '@angular/core';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styles: [
  ]
})
export class ImageModalComponent implements OnInit {

  public imageToUpload: File;
  public imgTemp: any = null;

  constructor(public modalImageService: ModalImageService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  closeModal(){
    this.modalImageService.closeModal();
    this.imgTemp = null;
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
    const id = this.modalImageService.id;
    const type = this.modalImageService.type;

    this.fileUploadService
        .updatePicture( this.imageToUpload, type, id)
        .then( img => {
          Swal.fire('Saved', 'Image updated', 'success');
          this.modalImageService.newImage.emit(img)
          this.closeModal();
        }).catch( err => {
          Swal.fire("Error", "Can't upload image", 'error');            
          });
  }

}
