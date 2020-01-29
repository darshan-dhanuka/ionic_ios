import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ToastService } from 'src/app/toast.service';
import { Router } from '@angular/router';
@Component({
 selector: 'app-how-to-apply',
 templateUrl: './how-to-apply.page.html',
 styleUrls: ['./how-to-apply.page.scss'],
})
export class HowToApplyPage implements OnInit {

 constructor(private iab : InAppBrowser,private router: Router,private toastService: ToastService) { }

 loginUser: any = {
    userId: 0
  };

 email = '';

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