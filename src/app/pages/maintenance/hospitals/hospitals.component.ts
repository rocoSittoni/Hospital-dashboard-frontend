import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchsService } from 'src/app/services/searchs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: [
  ]
})
export class HospitalsComponent implements OnInit, OnDestroy {

  public hospitals: Hospital[] = [];
  public loading: boolean = true;
  public imgSubs: Subscription;
  public hospitalTemps: Hospital[] = [];

  constructor(private hospitalService: HospitalService,
              private modalImageService: ModalImageService,
              private searchsService: SearchsService) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.loadHospitals();
    this.imgSubs = this.imgSubs = this.modalImageService.newImage
      .pipe(delay(100))
      .subscribe( img => this.loadHospitals() );
  }

  search(term: string){
    if(term.length === 0){
      return this.loadHospitals();
    }
    this.searchsService.search('hospitals', term)
        .subscribe( resp => {
          this.hospitals = resp;
        });
  }

  loadHospitals(){
    this.loading = true;
    this.hospitalService.loadHospitals()
      .subscribe( hospitals => {
        this.loading = false;
        this.hospitals = hospitals;
      })
  }

  saveChanges(hospital: Hospital){
    this.hospitalService.updateHospital(hospital._id, hospital.name)
        .subscribe( resp => {
          Swal.fire('Updated', hospital.name, 'success');
        });
  }

  deleteHospital(hospital: Hospital){
    this.hospitalService.deleteHospital(hospital._id)
        .subscribe( resp => {
          this.loadHospitals();
          Swal.fire('Deleted', hospital.name, 'success');
        });
  }

  async openSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      inputLabel: 'Create hospital',
      input: 'text',
      inputPlaceholder: 'Hospital name',
      showCancelButton: true
    })
    if( value.trim().length > 0 ){
      this.hospitalService.createHospital(value)
          .subscribe( (resp:any) => {
            this.hospitals.push(resp.hospital)
          });
    }
  }

  openModal(hospital: Hospital){
    this.modalImageService.openModal('hospitals', hospital._id, hospital.img);
  }



}
