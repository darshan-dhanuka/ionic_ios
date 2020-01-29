import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ToastService } from 'src/app/toast.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ProfileService } from './profile.service';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { MustMatch } from '../../must-match';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit {

  constructor(
    private router: Router,
    private camera: Camera,
    private file: File,
    private storage: Storage,
    public actionSheetController: ActionSheetController,
    private profileService: ProfileService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder) { }

  loginUser: any = {
    userId: 0
  };

  loginUserProfile: any = {
    "hashtag_id": "",
    "email": "",
    "mobile": "",
    "gender": "",
    "address": "",
    "user_id": 0
  }

  imageUrl = "";
  validationMessages: any;
  validationMessagesForChangePassword: any;
  editProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  selectedSagment = "persnolinformation";
  isEdit: boolean = false;
  submitted = false;

  async ngOnInit() {
    this.editProfileForm = this.formBuilder.group({
      gender: new FormControl('', [Validators.required]),
      contact: new FormControl('', [Validators.required,
      Validators.maxLength(10),
      Validators.minLength(10),
      Validators.pattern("^[0-9]*$"),
      this.noWhitespaceValidator]),
      address: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
    });

    this.validationMessages = {
      'contact': [
        { type: 'pattern', message: 'Only numbers allow.' },
        { type: 'maxlength', message: 'Number must be at least 10 character.' },
        { type: 'minlength', message: 'Number must be at least 10 character.' },
        { type: 'whitespace', message: 'This field can not be empty.' }
      ],
      'address': [
        { type: 'whitespace', message: 'This field can not be empty.' }
      ],
      'gender': [
        { type: 'required', message: 'Gender is required.' }
      ]
    }

    this.changePasswordForm = this.formBuilder.group({
      oldPassword: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), this.noWhitespaceValidator]),
      confirmPassword: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
    }, {
        validator: MustMatch('newPassword', 'confirmPassword')
      }
    );

    this.validationMessagesForChangePassword = {
      'oldPassword': [
        { type: 'whitespace', message: 'This field can not be empty.' }
      ],
      'newPassword': [
        { type: 'whitespace', message: 'This field can not be empty.' },
        { type: 'minlength', message: 'New Password minimum 6 character.' }
      ],
      'confirmPassword': [
        { type: 'whitespace', message: 'This field can not be empty.' },
        { type: 'mustMatch', message: 'Passwords must match' },
      ]
    }

    if (this.toastService.getLoginUser()) {
      this.loginUser = await this.toastService.getLoginUser();
      this.getLoginUserProfile(this.loginUser.userId);
    } else {
      this.router.navigate([''])
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Gallery',
        icon: 'gallery',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  takePicture(PHOTOLIBRARY: number): any {
    var options = {
      quality: 100,
      sourceType: PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then((imagePath) => {
      if (PHOTOLIBRARY === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.uploadPhoto(imagePath);
      } else {
        this.uploadPhoto(imagePath);
      }
    }, (err) => {
      this.toastService.presentToast("Error while selecting image.");
    });
  }

  private readFile(file: File) {
    this.postData(file);
  }

  private async postData(formData: any) {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      let formDataObj = new FormData();
      formDataObj.append("user_email", this.loginUserProfile.email);
      formDataObj.append("profile_pic", formData);
      this.profileService.updateUserProfileImage(formDataObj).then((data: any) => {
        console.log(data);
        loading.dismiss();
        if (data.errorcode == 0) {
          this.loginUser.profile = data.url;
          this.toastService.presentToast("Profile updated successfully.");
          this.storage.set("userDetail", JSON.stringify(this.loginUser));
        } else {
          this.toastService.presentToast(data.msg);
        }
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });
    }
  }

  uploadPhoto(imagePath: any): any {
    let self = this;
    this.file.resolveLocalFilesystemUrl(imagePath).then((entry: any) => {
      entry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function (encodedFile: any) {
          var src = encodedFile.target.result;
          src = src.split("base64,");
          var contentAsBase64EncodedString = src[1];
          self.readFile(contentAsBase64EncodedString);
        };
        reader.readAsDataURL(file);
      })
    }).catch((error) => {
      this.toastService.presentToast("Error while create image.");
    })
  }

  async getLoginUserProfile(userId: any) {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      this.profileService.getUserProfile({
        "user_id": userId
      }).then((data: any) => {
        loading.dismiss();
        if (data.errorcode == 0) {
          this.loginUserProfile = data;
        }
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });
    }
  }

  getImageUrl(url) {
    if (this.toastService.checkLiveUrl(url)) {
      return url;
    } else {
      return environment.imageUrl + url;
    }
  }

  get f() { return this.editProfileForm.controls; }
  get fp() { return this.changePasswordForm.controls; }

  isEditTrue() {
    if (this.isEdit == false) {
      this.isEdit = true;
      this.editProfileForm.controls['address'].setValue(this.loginUserProfile.address);
      this.editProfileForm.controls['contact'].setValue(this.loginUserProfile.mobile);
      this.editProfileForm.controls['gender'].setValue(this.loginUserProfile.gender);
    } else {
      this.isEdit = false;
    }
  }
  async submitChangePassword(changePasswordForm) {
    this.submitted = true;
    if (changePasswordForm.invalid) {
      return
    } else {
      debugger
      this.loginUserProfile = {
        "password": changePasswordForm.value.oldPassword,
        "new_password": changePasswordForm.value.newPassword,
        "email": this.loginUserProfile.email
      }
      if (this.toastService.checkNetwork()) {
        let loading = await this.toastService.presentLoading();
        let data: any = {};
        this.profileService.changeUserPassword(this.loginUserProfile).then((data: any) => {
          loading.dismiss();
          if (data.errorcode == 0) {
            this.toastService.presentToast("Password changed successfully");
            this.isEdit = false;
            this.changePasswordForm.reset();
            setTimeout(() => {
              this.router.navigate(['/home/tabs/home'])
            }, 1500);

          }
          if (data.errorcode == 1) {
            this.toastService.presentToast("Something went wrong. Please try again later");
            this.isEdit = false;
          }
          if (data.errorcode == 2) {
            this.toastService.presentToast("Please put correct old password");
            this.isEdit = false;
          }
        }).catch(e => {
          loading.dismiss();
          this.toastService.presentToast("Internal server error");
        });
      }
    }
  }

  async submitProfile(editProfileForm) {
    this.submitted = true;
    if (editProfileForm.invalid) {
      this.toastService.presentToast("Please enter all required field value.");
    } else {
      this.loginUserProfile = {
        "hashtag_id": this.loginUserProfile.hashtag_id,
        "email": this.loginUserProfile.email,
        "mobile": editProfileForm.value.contact,
        "gender": editProfileForm.value.gender,
        "address": editProfileForm.value.address,
        "user_id": this.loginUser.userId
      }
      if (this.toastService.checkNetwork()) {
        let loading = await this.toastService.presentLoading();
        let data: any = {};
        this.profileService.updateUserProfile(this.loginUserProfile).then((data: any) => {

          loading.dismiss();
          if (data.errorcode == 0) {
            this.editProfileForm.reset();
            this.isEdit = false;
            this.toastService.presentToast("Profile updated successfully");
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

  segmentChanged(event) {
    this.selectedSagment = event.detail.value;
  }
}
