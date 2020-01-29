import { Component, OnInit } from '@angular/core';
import { UserLevelService } from './user-level.service';
import { ToastService } from 'src/app/toast.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-user-level',
  templateUrl: './user-level.page.html',
  styleUrls: ['./user-level.page.scss'],
})
export class UserLevelPage implements OnInit {

  constructor(private userLevelService: UserLevelService,private toastService: ToastService,private router: Router,private storage: Storage) { }
  loginUser: any = {
    userId: 0
  };
  async ngOnInit() {
    if (this.toastService.getLoginUser()) {
      this.loginUser = await this.toastService.getLoginUser();
      let loginType = await this.toastService.getLoginUser();
      
    } else {
      this.router.navigate([''])
    }
  }

  async userLevelSet(level)
  {   
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      this.userLevelService.setLevel(this.loginUser.email, level).then((data: any) => {
        loading.dismiss();
        this.router.navigate(['/home/tabs/home']);
        this.storage.set("level_set", "done_level");
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });;
    }
  }
}
