import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from './register.service';
import { ToastService } from '../../toast.service';
import { ModalController } from '@ionic/angular';
import { OtpComponent } from '../../component/otp/otp.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  submitted = false;
  registerForm: FormGroup;
  validationMessages: any;

  constructor(public modalController: ModalController, private toastService: ToastService, private registerService: RegisterService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      uname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      name: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      password: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      agree: new FormControl(false, [Validators.requiredTrue]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10), Validators.minLength(10), this.noWhitespaceValidator])
    });
    this.validationMessages = {
      'name': [
        { type: 'whitespace', message: 'This field can not be empty.' }
      ],
      'uname': [
        { type: 'whitespace', message: 'This field can not be empty.' }
      ],
      'email': [
        { type: 'email', message: 'Please enter valid email.' },
        { type: 'whitespace', message: 'This field can not be empty.' }
      ],
      'phone': [
        { type: 'pattern', message: 'Only numbers are allowed.' },
        { type: 'whitespace', message: 'This field can not be empty.' },
        { type: 'maxLength', message: 'Contact number must be 10 numbers.' },
        { type: 'minLength', message: 'Contact number must be 10 numbers.' },
      ],
      'password': [
        { type: 'whitespace', message: 'This field can not be empty.' }
      ],
      'agree': [
        { type: 'required', message: 'Please accept terms.' }
      ]
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  get f() { return this.registerForm.controls; }

  async submitRegister(registerForm: FormGroup) {
    this.submitted = true;
    if (registerForm.invalid) {
      return;
    }
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      this.registerService.createUser(registerForm.value).then((result: any) => {
        loading.dismiss();
        this.submitted = false;
        this.toastService.presentToast("You are register successfully");
        setTimeout(() => {
          this.registerForm.reset();
          this.router.navigate(['/login']);
        }, 2000)
      }).catch(e => {
        loading.dismiss();

        if (e.status == 422) {
          if (e.error.uname && e.error.uname.length != 0) {
            this.toastService.presentToast(e.error.uname[0])
          }
        }
      });
    }
  }

  async sendOtp() {
    const phone = this.registerForm.value.phone;
    if (phone) {
      if (this.toastService.checkNetwork()) {
        let loading = await this.toastService.presentLoading();
        this.registerService.sendOtp({ "phone": phone }).then(async (result: any) => {
          loading.dismiss();
          if (result.errorcode == 0) {
            this.toastService.presentToast(result.msg);
            const modal = await this.modalController.create({
              component: OtpComponent,
              componentProps: {
                'phone': phone,
                cssclass: 'my-otp-modal-css'
              }
            });
            await modal.present();
          } else {
            this.toastService.presentToast(result.msg);
          }
        }).catch(e => {
          loading.dismiss();
          if (e.status == 422) {
            if (e.error.uname && e.error.uname.length != 0) {
              this.toastService.presentToast(e.error.uname[0])
            }
          }
        });
      }

    } else {
      this.toastService.presentToast("Please enter phone number");
    }
  }
}
