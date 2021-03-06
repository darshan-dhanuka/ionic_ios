import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { WatchPage } from './watch.page';
import { HeaderModule } from '../../component/header/header.module';

const routes: Routes = [
  {
    path: '',
    component: WatchPage
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
  declarations: [WatchPage]
})
export class WatchPageModule { }
