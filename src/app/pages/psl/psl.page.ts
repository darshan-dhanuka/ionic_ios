import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToastService } from 'src/app/toast.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-psl',
  templateUrl: './psl.page.html',
  styleUrls: ['./psl.page.scss'],
})
export class PslPage implements OnInit {

  loginUser: any = {
    userId: 0
  };

  email = '';

  constructor(private iab : InAppBrowser,private router: Router,private toastService: ToastService) { }

  async ngOnInit() {

    if (this.toastService.getLoginUser()) {
        this.loginUser = await this.toastService.getLoginUser();
        let loginType = await this.toastService.getLoginUser();
        //console.log(this.loginUser);
        //alert(this.loginUser.email);
        this.email = this.loginUser.email;
       
      } else {
        this.router.navigate([''])
      }
 }

  OpenUrl()
  {
  const browser = this.iab.create('https://www.pokersportsleague.com/qualifier?email='+this.email+'&app_flag=1');
  browser.show()
  }
  
 }
