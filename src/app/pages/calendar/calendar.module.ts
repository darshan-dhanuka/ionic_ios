import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CalendarPage } from './calendar.page';
import { HeaderModule } from '../../component/header/header.module';
import { MiAccEventComponent } from 'src/app/component/mi-acc-event/mi-acc-event.component';

const routes: Routes = [
  {
    path: '',
    component: CalendarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CalendarPage, MiAccEventComponent]
})
export class CalendarPageModule {}
