import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { ToastService } from 'src/app/toast.service';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  @Input() mobile: string;
  validationMessages: any;
  validationMessagesOtp: any;
  validationMessagesPassword: any;
  submitted = false;
  mobileForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  forgotPassword: boolean = true;
  enterOtp: boolean = false;
  resetPassword: boolean = false;
  phone1: any;
  constructor(private modelCtrl: ModalController,
    private forgotpasswordService: ForgotPasswordService,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    navParams: NavParams) {
    this.mobile = navParams.get('mobile');
  }
  get f() { return this.mobileForm.controls; }
  get fo() { return this.otpForm.controls; }
  get fp() { return this.passwordForm.controls; }

  ngOnInit() {
    this.mobileForm = this.formBuilder.group({
      phone: new FormControl('', [Validators.required])
    });
    this.validationMessages = {
      'phone': [
        { type: 'required', message: 'Mobile is required.' }
      ]
    }
    //otp_text
    this.otpForm = this.formBuilder.group({
      otp_text: new FormControl('', [Validators.required])
    });
    this.validationMessagesOtp = {
      'otp_text': [
        { type: 'required', message: 'OTP is required.' }
      ]
    }
    //password
    this.passwordForm = this.formBuilder.group({
      password: new FormControl('', [Validators.required])
    });
    this.validationMessagesPassword = {
      'password': [
        { type: 'required', message: 'Password is required.' }
      ]
    }
  }
  async submitMobile(mobileForm: FormGroup) {
    this.submitted = true;
    if (mobileForm.invalid) {
      return;
    } else {
      this.phone1 = mobileForm.value.phone;
      if (this.toastService.checkNetwork()) {
        let loading = await this.toastService.presentLoading();
        this.forgotpasswordService.sendOtp({
          phone: this.mobileForm.value.phone
        }).then((result: any) => {
          loading.dismiss();
          if (result.errorcode == 0) {
            this.forgotPassword = false;
            this.enterOtp = true;
            this.toastService.presentToast(result.msg);
          } else if (result.errorcode == 1) {
            this.toastService.presentToast(result.msg);
          } else {
            this.toastService.presentToast(result.msg);
          }
          console.log(result)
        }).catch(e => {
          loading.dismiss();
          this.toastService.presentToast("Internal Server Error");
        });
      }
    }
  }

  async submitOtp(otpForm: FormGroup) {
    this.submitted = true;
    if (otpForm.invalid) {
      return;
    } else {
      if (this.toastService.checkNetwork()) {
        let loading = await this.toastService.presentLoading();
        this.forgotpasswordService.verifyOtp({
          otp_text: otpForm.value.otp_text,
          phone1: this.phone1
        }).then((result: any) => {
          loading.dismiss();
          if (result.errorcode == 0) {
            this.enterOtp = false;
            this.resetPassword = true;
            this.toastService.presentToast(result.msg);
          } else {
            this.toastService.presentToast(result.msg);
          }
        }).catch(e => {
          loading.dismiss();
          this.toastService.presentToast("Internal Server Error");
        });
      }

    }
  }
  async submitPassword(passwordForm: FormGroup) {
    this.submitted = true;
    if (passwordForm.invalid) {
      return;
    } else {
      if (this.toastService.checkNetwork()) {
        let loading = await this.toastService.presentLoading();
        this.forgotpasswordService.resetPassword({
          "phone1": this.phone1,
          "password": passwordForm.value.password
        }).then((result: any) => {
          loading.dismiss();
          if (result.errorcode == 0) {
            this.toastService.presentToast(result.msg);
            this.modelCtrl.dismiss();
          } else {
            this.toastService.presentToast(result.msg);
          }
        }).catch(e => {
          loading.dismiss();
          this.modelCtrl.dismiss();
          this.toastService.presentToast("Internal Server Error");
        });
      }
    }
  }

}
