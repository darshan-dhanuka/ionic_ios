import { Component, OnInit } from '@angular/core';
import { CalendarService } from './calendar.service';
import { ToastService } from 'src/app/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  constructor(private toastService: ToastService, private calendarservice: CalendarService,private router: Router) {

  }
  tabs: any = [];
  homeNews = [];
  newsFooter = '';

  loginUser: any = {
    userId: 0
  };


  async ngOnInit() {
    this.getTab();

    if (this.toastService.getLoginUser()) {
      this.loginUser = await this.toastService.getLoginUser();
      let loginType = await this.toastService.getLoginUser();
      //console.log(this.loginUser);
      //alert(this.loginUser.email);
     
    } else {
      this.router.navigate([''])
    }

  }
/*icon: item.title.toString().toLowerCase() + ".png",*/

  async getTab() {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      let data: any = {};
      this.calendarservice.getTab().then((data: any) => {
        loading.dismiss();
        if (data.errorcode == 0) {
          this.tabs = data.result;
          for (const item of data.result) {
            this.technologies.push(
              {
                name: item.eventTitle,
                fromdate: item.eventFromdate,
                todate: item.eventTodate,
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

  public technologies: Array<{ name: string, description: string,fromdate: string,todate: string,isMenuOpen: boolean }> = [];

  

  public captureName(event: any): void {
    for (const item of this.technologies) {
      if (event == item.name) {
        item.isMenuOpen = true;
      } else {
        item.isMenuOpen = false;
      }
    }
  }

}
