import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncreaserComponent } from './increaser/increaser.component';
import { FormsModule } from '@angular/forms';
import { DonutComponent } from './donut/donut.component';
import { ChartsModule } from 'ng2-charts';
import { ImageModalComponent } from './image-modal/image-modal.component';



@NgModule({
  declarations: [
    IncreaserComponent, 
    DonutComponent, ImageModalComponent
  ],
  exports: [
    IncreaserComponent,
    DonutComponent,
    ImageModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
