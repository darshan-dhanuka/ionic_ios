import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { Platform, MenuController, ModalController, ActionSheetController, PopoverController, IonRouterOutlet, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { environment } from 'src/environments/environment';
import { CommunicationService } from './communication.service';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(IonRouterOutlet, null) routerOutlet: IonRouterOutlet;
  async ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      if (this.router.url === '/login') {
        navigator['app'].exitApp();
      } else if (this.router.url === '/home/tabs/home') {
        this.toastService.presentAlert("Exit", "", "Are you sure you want to exit app?", [
          {
            text: 'No',
            role: 'cancel',
            handler: (blah) => {
            }
          }, {
            text: 'Yes',
            handler: () => {
              navigator['app'].exitApp();
            }
          }
        ]);
      } else {
        this._location.back();
      }

      // try {
      //   const element = await this.actionSheetCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (error) {
      // }

      // // close popover
      // try {
      //   const element = await this.popoverCtrl.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (error) {
      // }

      // // close modal
      // try {
      //   const element = await this.modalController.getTop();
      //   if (element) {
      //     element.dismiss();
      //     return;
      //   }
      // } catch (error) {
      //   console.log(error);

      // }

      // // close side menua
      // try {
      //   const element = await this.menu.getOpen();
      //   if (element) {
      //     this.menu.close();
      //     return;

      //   }

      // } catch (error) {

      // }

      // this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
      //   if (this.router.url === '/home/tabs/home') {
      //     this.toastService.presentAlert("Exit", "", "Are you sure you want to exit app?", [
      //       {
      //         text: 'No',
      //         role: 'cancel',
      //         handler: (blah) => {
      //         }
      //       }, {
      //         text: 'Yes',
      //         handler: () => {
      //           navigator['app'].exitApp();
      //         }
      //       }
      //     ]);
      //   } else if (this.router.url === '/login') {
      //     navigator['app'].exitApp();
      //   } else {
      //     outlet.pop();
      //   }
      // });
    });
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }
  backButtonSubscription;
  ngOnInit() {
    this.data.currentMessage.subscribe(async message => {
      if (message) {
        this.loginUser = JSON.parse(message);
      }
    })
  }
  navigate: any;
  loginUser = {
    fullName: '',
    profile: null
  }
  constructor(
    public modalController: ModalController,
    private platform: Platform,
    private storage: Storage,
    private menu: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private toastService: ToastService,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, private _location: Location,

    private menuCtrl: MenuController,
    private router: Router,
    private navCtrl: NavController,
    private data: CommunicationService,
    private appUpdate: AppUpdate
  ) {
    this.initializeApp();
  }

  menuClose() {
    this.menuCtrl.close();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.styleDefault();
      this.statusBar.backgroundColorByHexString('#ffffff');
      const updateUrl = 'https://pokersportsleague.com/file/my_app_update.xml';
      this.appUpdate.checkAppUpdate(updateUrl).then(update => {
        console.log("Update Status:  " + update.msg);
      }).catch(error => {
        console.log(error);
      });
      this.storage.get("loginStatus").then((result: any) => {
        if (result) {
          this.menuCtrl.enable(true, 'sidemenu');
          this.splashScreen.hide();
          this.router.navigate(['/home'])
        } else {
          this.menuCtrl.enable(true, 'sidemenu');
          this.splashScreen.hide();
          this.router.navigate(['/login'])
        }
      });
      if (this.toastService.getLoginUser()) {
        this.loginUser = await this.toastService.getLoginUser();
      } else {
        this.router.navigate(['/login'])
      }
    });
  }

  doLogOut() {
    this.menuClose();
    this.menuCtrl.enable(false, 'sidemenu');
    this.storage.remove('loginType');
    this.storage.remove("loginStatus");
    this.storage.remove("token");
    this.storage.remove("userDetail");
    this.router.navigate(['/login']);
  }


  getImageUrl(url) {
    if (url) {
      if (this.toastService.checkLiveUrl(url)) {
        return url;
      } else {
        return environment.imageUrl + url;
      }
    } else {
      return '../../assets/images/userimg.png';
    }
  }



}
