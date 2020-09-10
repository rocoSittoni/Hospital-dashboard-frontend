import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncreaserComponent } from './increaser/increaser.component';
import { FormsModule } from '@angular/forms';
import { DonutComponent } from './donut/donut.component';
import { ChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    IncreaserComponent, 
    DonutComponent
  ],
  exports: [
    IncreaserComponent,
    DonutComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
