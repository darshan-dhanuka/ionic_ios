import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { HeaderModule } from 'src/app/component/header/header.module';
import { FeedbackPage } from './feedback.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HeaderModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FeedbackPage]
})
export class FeedbackPageModule {}
