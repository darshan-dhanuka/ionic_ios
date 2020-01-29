import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private menuCtrl: MenuController, private router: Router, private storage: Storage) {
    console.log("Splash")
    this.storage.get("appInstall").then((result1: any) => {
      if (result1) {
        this.storage.get("loginStatus").then((result: any) => {
          if (result) {
            this.menuCtrl.enable(true, 'sidemenu');
            this.router.navigate(['/home/tabs/home']);
          } else {
            this.menuCtrl.enable(false, 'sidemenu');
            this.router.navigate(['/login']);
          }
        })
      } else {
        this.menuCtrl.enable(false, 'sidemenu');
        this.router.navigate(['/welcome']);
      }
    })
  }

  ngOnInit() {
    this.storage.get("appInstall").then((result1: any) => {
      if (result1) {
        this.storage.get("loginStatus").then((result: any) => {
          if (result) {
            this.menuCtrl.enable(true, 'sidemenu');
            this.router.navigate(['/home/tabs/home']);
          } else {
            this.menuCtrl.enable(false, 'sidemenu');
            this.router.navigate(['/login']);
          }
        })
      } else {
        this.menuCtrl.enable(false, 'sidemenu');
        this.router.navigate(['/welcome']);
      }
    })
  }

}
