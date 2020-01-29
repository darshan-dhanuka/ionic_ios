import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from '../../component/header/header.module';
import { TeamsPage } from './teams.page';

const routes: Routes = [
  {
    path: '',
    component: TeamsPage
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
  declarations: [TeamsPage]
})
export class TeamsPageModule {}
