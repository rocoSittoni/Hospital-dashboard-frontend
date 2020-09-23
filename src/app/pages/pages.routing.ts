import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';


const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent, data:{titulo: 'Dashboard'} },
            { path: 'progress', component: ProgressComponent, data:{titulo: 'progress'} },
            { path: 'grafica1', component: Grafica1Component, data:{titulo: 'grafica1'} },
            { path: 'account-settings', component: AccountSettingsComponent, data:{titulo: 'account-settings'} },
            { path: 'promises', component: PromisesComponent, data:{titulo: 'promises'} },
            { path: 'rxjs', component: RxjsComponent, data:{titulo: 'rxjs'} },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
        ]
    }
];

@NgModule({
    imports: [ RouterModule.forChild(routes)],
    exports: [ RouterModule ]
})

export class PagesRoutingModule {}