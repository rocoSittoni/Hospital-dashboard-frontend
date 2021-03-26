import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './maintenance/users/users.component';
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';
import { DoctorComponent } from './maintenance/doctors/doctor.component';


const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            { path: 'dashboard', component: DashboardComponent, data:{titulo: 'Dashboard'} },
            { path: 'progress', component: ProgressComponent, data:{titulo: 'Progress'} },
            { path: 'grafica1', component: Grafica1Component, data:{titulo: 'Grafica1'} },
            { path: 'account-settings', component: AccountSettingsComponent, data:{titulo: 'Account-settings'} },
            { path: 'promises', component: PromisesComponent, data:{titulo: 'Promises'} },
            { path: 'rxjs', component: RxjsComponent, data:{titulo: 'Rxjs'} },
            { path: 'profile', component: ProfileComponent, data:{titulo: 'Profile'} },
            
            // maintenance
            { path: 'users', component: UsersComponent, data:{titulo: 'Users'} },
            { path: 'hospitals', component: HospitalsComponent, data:{titulo: 'Hospitals'} },
            { path: 'doctors', component: DoctorsComponent, data:{titulo: 'Doctors'} },
            { path: 'doctor/:id', component: DoctorComponent, data:{titulo: 'Doctor'} },
        ]

    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})

export class PagesRoutingModule {}