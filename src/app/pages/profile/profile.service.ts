import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LOGIN, GET_PROFILE, UPDATE_PROFILE, CHANGE_PASSWORD, UPDATE_PROFILE_PIC } from 'src/app/helper/constant';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  baseurl: any = "";
  constructor(private http: HttpClient) {
    this.baseurl = environment.baseUrl;
  }

  async getUserProfile(value: any) {
    return await this.http.post(this.baseurl + GET_PROFILE, value).toPromise();
  }
  async updateUserProfile(value: any) {
    return await this.http.post(this.baseurl + UPDATE_PROFILE, value).toPromise();
  }
  async changeUserPassword(value: any) {
    return await this.http.post(this.baseurl + CHANGE_PASSWORD, value).toPromise();
  }
  async updateUserProfileImage(value: any) {
    return await this.http.post(this.baseurl + UPDATE_PROFILE_PIC, value).toPromise();
  }
}
