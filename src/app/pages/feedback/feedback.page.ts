import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToastService } from 'src/app/toast.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FeedbackService } from './feedback.service';
import { File } from '@ionic-native/file/ngx';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {

  constructor(
    private router: Router,
    public actionSheetController: ActionSheetController,
    private feedbackService: FeedbackService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder
   ) { }

   loginUser: any = {
    userId: 0
  };

  loginUserProfile: any = {
    "userFeedback": "",
    "userEmail": "",
    "userName": "",
    "userId": 0
  }

  validationMessages: any;
  editProfileForm: FormGroup;
  submitted = false;
  
  async ngOnInit() {

    this.editProfileForm = this.formBuilder.group({
      feedback: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
     
    });

    this.validationMessages = {
      'feedback': [
        { type: 'whitespace', message: 'This field can not be empty.' }
      ]
    }

    if (this.toastService.getLoginUser()) {
      this.loginUser = await this.toastService.getLoginUser();
      let loginType = await this.toastService.getLoginUser();
      
    } else {
      this.router.navigate([''])
    }


  }
  
    public noWhitespaceValidator(control: FormControl) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }

    get f() { return this.editProfileForm.controls; }
   
    async submitFeedback(editProfileForm) {
      this.submitted = true;
      if (editProfileForm.invalid) {
        this.toastService.presentToast("Please enter all required field value.");
      } else {
        //console.log(this.loginUser);
        this.loginUserProfile = {
          "userFeedback": editProfileForm.value.feedback,
          "userEmail": this.loginUser.email,
          "userName": this.loginUser.fullName,
          "userId": this.loginUser.userId
        }
        if (this.toastService.checkNetwork()) {
          let loading = await this.toastService.presentLoading();
          let data: any = {};
          this.feedbackService.updateUserProfile(this.loginUserProfile).then((data: any) => {
  
            loading.dismiss();
            if (data.errorcode == 0) {
              this.editProfileForm.reset();
              this.toastService.presentToast("Feedback submitted successfully");
              setTimeout(() => {
                this.router.navigate(['/home/tabs/home'])
              }, 1500);
             
            }
          }).catch(e => {
            loading.dismiss();
            this.toastService.presentToast("Internal server error");
          });
        }
      }
    }
  

  }
