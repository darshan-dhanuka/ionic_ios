import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild('slides', null) slides: IonSlides;
  constructor(private storage: Storage, private router: Router) { }
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };

  ngOnInit() {
  }

  skipStep() {
    this.storage.set("appInstall", "true");
    this.router.navigate(['/login']);
  }

  next() {
    this.slides.slideNext();
  }

}
