import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlayPage } from './play.page';
import { HeaderModule } from '../../component/header/header.module';

const routes: Routes = [
  {
    path: '',
    component: PlayPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeaderModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PlayPage]
})
export class PlayPageModule { }
