import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SplashAuthGuard implements CanActivate {
  constructor(private menuCtrl: MenuController, private router: Router, private storage: Storage) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    console.log("call guard");
    return this.storage.get("appInstall").then((result1: any) => {
      if (result1) {
        return this.storage.get("loginStatus").then((result: any) => {
          if (result) {
            this.menuCtrl.enable(true, 'sidemenu');
            this.router.navigate(['/home/tabs/home']);
            return true;
          } else {
            this.menuCtrl.enable(false, 'sidemenu');
            this.router.navigate(['/login']);
            return true;
          }
        })
      } else {
        this.menuCtrl.enable(false, 'sidemenu');
        this.router.navigate(['/welcome']);
        return true;
      }
    })


  }

}
