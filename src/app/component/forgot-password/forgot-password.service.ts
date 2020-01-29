import { Injectable } from '@angular/core';
import { FORGOT_PASSWORD, FORGOT_VERIFY_OTP, RESET_PASSWORD_DEMO } from 'src/app/helper/constant';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  baseurl: any = "";
  constructor(private http: HttpClient) {
    this.baseurl = environment.baseUrl;
  }

  async sendOtp(value: any) {
    return await this.http.post(this.baseurl + FORGOT_PASSWORD, value).toPromise();
  }
  async verifyOtp(value: any) {
    return await this.http.post(this.baseurl + FORGOT_VERIFY_OTP, value).toPromise();
  }
  async resetPassword(value: any) {
    return await this.http.post(this.baseurl + RESET_PASSWORD_DEMO, value).toPromise();
  }
}
