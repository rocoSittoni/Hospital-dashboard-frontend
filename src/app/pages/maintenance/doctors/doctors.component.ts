import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Doctor } from 'src/app/models/doctor.model';
import { DoctorService } from 'src/app/services/doctor.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchsService } from 'src/app/services/searchs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: [
  ]
})
export class DoctorsComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public doctors: Doctor[] = [];
  public imgSubs: Subscription;

  constructor( private doctorService: DoctorService,
               private modalImageService: ModalImageService,
               private searchsService: SearchsService ) {}
  ngOnDestroy(): void{
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadDoctors()
    this.imgSubs = this.imgSubs = this.modalImageService.newImage
      .pipe(delay(100))
      .subscribe( img => this.loadDoctors() );
  }

  loadDoctors(){
    this.loading = true;
    this.doctorService.loadDoctors()
        .subscribe( doctors => {
          this.loading = false;
          this.doctors = doctors;
        })
  }

  search(term: string){
    if(term.length === 0){
      return this.loadDoctors();
    }
    this.searchsService.search('doctors', term)
        .subscribe( resp => {
          this.doctors = resp;
        });
  }

  openModal(doctor: Doctor){
    this.modalImageService.openModal('doctors', doctor._id, doctor.img);
  }

  deleteDoctor(doctor:Doctor){
    Swal.fire({
      title: 'sure you want to delete doctor?',
      text: `you are about to delete ${doctor.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete'
    })
    .then((result) => {
      if (result.isConfirmed) {
        this.doctorService.deleteDoctor(doctor._id)
            .subscribe( resp => {
              this.loadDoctors();
              Swal.fire(
                'Doctor deleted', 
                `${doctor.name} was correctly deleted`, 
                'success'
              );
            });
      }
    })
  }

}