import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoginService, Social } from './login.service';
import { ToastService } from '../../toast.service';
import { Storage } from '@ionic/storage';
import { MenuController, Platform, ModalController } from '@ionic/angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { __await } from 'tslib';
import { ForgotPasswordComponent } from '../../component/forgot-password/forgot-password.component';
import { CommunicationService } from 'src/app/communication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  validationMessages: any;
  loadingController: boolean;
  submitted = false;
  userDetail = {
    email: "",
    password: ""
  }
  show: boolean;

  constructor(
    public modalController: ModalController,
    private loginService: LoginService,
    private storage: Storage,
    private platform: Platform,
    private menuCtrl: MenuController,
    private fb: Facebook,
    private google: GooglePlus,
    private fireAuth: AngularFireAuth,
    private toastService: ToastService,
    private data: CommunicationService,
    private router: Router,
    private formBuilder: FormBuilder) { this.show = false }

  ngOnInit() {
    if (this.storage.get("remember")) {
      this.storage.get("remember").then((detail) => {
        if (detail) {
          this.userDetail = JSON.parse(atob(detail));
          this.loginForm.controls['email'].setValue(this.userDetail.email);
          this.loginForm.controls['password'].setValue(this.userDetail.password);
          this.loginForm.controls['remember'].setValue(true);
        }
      })
    }
    this.loginForm = this.formBuilder.group({
      email: new FormControl(this.userDetail.email, [Validators.required, Validators.email, this.noWhitespaceValidator]),
      password: new FormControl(this.userDetail.password, [Validators.required]),
      remember: new FormControl(),
    });
    this.validationMessages = {
      'email': [
        { type: 'email', message: 'Please enter valid email.' },
        { type: 'whitespace', message: 'This field can not be null or whitespace' }
      ],
      'password': [
        { type: 'required', message: 'Password is required.' },
      ]
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.loginForm.controls; }

  showPassword() {
    this.show = !this.show;
  }

  async submitLogin(loginForm) {
    this.submitted = true;
    if (loginForm.invalid) {
      return;
    }
    if (this.toastService.checkNetwork()) {

      let loading = await this.toastService.presentLoading();
      this.loginService.createLogin(loginForm.value).then((result: any) => {
        loading.dismiss();
        if (result.errorcode == 0) {
          this.menuCtrl.enable(true, 'sidemenu');
          this.storage.set('loginType', "LOCAL");
          this.storage.set('loginStatus', 1);
          this.storage.set('token', result.token);
          this.storage.set("userDetail", JSON.stringify(result));
          this.data.changeMessage(JSON.stringify(result));
          if (loginForm.value.remember === true) {
            this.userDetail.email = loginForm.value.email;
            this.userDetail.password = loginForm.value.password;
            this.storage.set('remember', btoa(JSON.stringify(this.userDetail)));
          } else {
            this.storage.remove('remember');
          }
          this.storage.get("level_set").then((result1: any) => {
            if (result1) {
              this.router.navigate(['/home/tabs/home']);
            } else {
              this.router.navigate(['/user-level']); 
            }
          });
        } else {
          this.toastService.presentToast(result.msg);
        }
      }).catch(e => {
        loading.dismiss();
        if (e.status == 400) {
          if (e.error.error == "invalid_credentials") {
            this.toastService.presentToast("Please enter valid credentials");
          }
        }
      });
    }
  }

  async loginWithFacebook() {
    if (this.toastService.checkNetwork()) {
      const permissions = ["public_profile", "email"];
      this.fb.login(permissions)
        .then((response: FacebookLoginResponse) => {
          this.onLoginSuccess(response);
        }).catch((error) => {
          this.toastService.presentToast(error);
        });
    }
  }

  onLoginSuccess(res: FacebookLoginResponse) {
    const credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    this.fireAuth.auth.signInWithCredential(credential).then((response: any) => {
      console.log(response);
      let userInfo = response.additionalUserInfo;
      let social = new Social(userInfo.profile.email,
        response.credential.accessToken,
        userInfo.profile.first_name,
        userInfo.profile.id,
        userInfo.profile.last_name,
        userInfo.profile.name,
        userInfo.profile.picture.data.url,
        "FACEBOOK");
      this.generateSocialLogin(social);
    })
  }

  async generateSocialLogin(request: any) {
    let loading = await this.toastService.presentLoading();
    this.loginService.createSocial(request).then((result: any) => {
      loading.dismiss();
      if (result.errorcode == 0) {
        this.menuCtrl.enable(true, 'sidemenu');
        this.storage.set('loginType', "SOCIAL");
        this.storage.set('loginStatus', 1);
        this.storage.set('token', result.token);
        this.storage.set("userDetail", JSON.stringify(result));
        this.data.changeMessage(JSON.stringify(result));
        this.storage.get("level_set").then((result1: any) => {
          if (result1) {
            this.router.navigate(['/home/tabs/home']);
          } else {
            this.router.navigate(['/user-level']); 
          }
        });
      } else {
        this.toastService.presentToast(result.msg);
      }
    }).catch(e => {
      loading.dismiss();
      this.toastService.presentToast("Please enter valid credentials");
    });
  }

  async doGoogleLogin() {
    if (this.toastService.checkNetwork()) {
      if (this.platform.is('cordova')) {
        let params = {
          'webClientId': '593561012939-j8f1ho5e6ffbsegkh0n1dbsvj8aobob8.apps.googleusercontent.com',
          'offline': true
        }
        let googleUser: any = await this.google.login(params);
        const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken);
        this.fireAuth.auth.signInWithCredential(credential).then((responseGoogle: any) => {
          let userInfo = responseGoogle.additionalUserInfo;
          let social = new Social(userInfo.profile.email,
            responseGoogle.credential.idToken,
            userInfo.profile.given_name,
            userInfo.profile.sub,
            userInfo.profile.family_name,
            userInfo.profile.name,
            userInfo.profile.picture,
            "GOOGLE");
          this.generateSocialLogin(social);
        })
      } else {
        const provider = new firebase.auth.GoogleAuthProvider();
        const responseGoogle: any = await this.fireAuth.auth.signInWithPopup(provider);
        let userInfo = responseGoogle.additionalUserInfo;
        let social = new Social(userInfo.profile.email,
          responseGoogle.credential.idToken,
          userInfo.profile.given_name,
          userInfo.profile.sub,
          userInfo.profile.family_name,
          userInfo.profile.name,
          userInfo.profile.picture,
          "GOOGLE");
        this.generateSocialLogin(social);
      }
    }
  }

  async forgotPassword() {
    if (this.toastService.checkNetwork()) {
      var loading = await this.toastService.presentLoading();
      const modal = await this.modalController.create({
        component: ForgotPasswordComponent,
        componentProps: {
          cssclass: 'my-forgot-modal-css'
        }
      });
      await modal.present();
      loading.dismiss();
    }
  }

  navigate() {

  }
}