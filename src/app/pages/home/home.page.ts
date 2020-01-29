import { Component, OnInit } from '@angular/core';
import { HomeService } from './home.service';
import { ToastService } from 'src/app/toast.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  email = '';
  constructor(private iab: InAppBrowser, private toastService: ToastService, private homeservice: HomeService) {

  }
  tabs: any = [];
  homeNews = [];
  newsFooter = '';
  imageName = '';
  ngOnInit() {
    this.getTab();
    this.getHomeNews();
  }

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 1000,
    autoplay: {
      disableOnInteraction: false
    }
  };

  async getTab() {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      let data: any = {};
      this.homeservice.getTab().then((data: any) => {
        loading.dismiss();
        if (data.errorcode == 0) {
          this.tabs = data.result;
          for (const item of data.result) {
            this.imageName = item.title;
            if (item.title == "POKER SPORTS LEAGUE") {
              this.imageName = "PSL";
            }

            this.technologies.push(
              {
                icon: this.imageName.toString().toLowerCase() + ".png",
                name: item.title,
                description: item.description,
                isMenuOpen: false
              }
            )
          }
        }
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });;
    }
  }

  public technologies: Array<{ name: string, description: string, icon: string, isMenuOpen: boolean }> = [];

  async getHomeNews() {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      let data: any = {};
      this.homeservice.getHomeNews().then((data: any) => {
        loading.dismiss();
        if (data.errorcode == 0) {
          for (const item of data.result) {
            this.homeNews.push(item.description)
          }
          this.newsFooter = this.homeNews.join(" | ");
        }
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });;
    }
  }

  public captureName(event: any): void {
    for (const item of this.technologies) {
      if (event == item.name) {
        item.isMenuOpen = true;
      } else {
        item.isMenuOpen = false;
      }
    }
  }
  OpenUrl() {
    const browser = this.iab.create('https://www.pokersportsleague.com/qualifier?email=' + this.email + '&app_flag=1');
    browser.show()
  }

}
