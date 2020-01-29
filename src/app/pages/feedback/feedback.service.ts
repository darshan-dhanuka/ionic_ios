import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LOGIN, FEEDBACK } from 'src/app/helper/constant';


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  baseurl: any = "";
  constructor(private http: HttpClient) {
    this.baseurl = environment.baseUrl;
  }


  async updateUserProfile(value: any) {
    return await this.http.post(this.baseurl + FEEDBACK, value).toPromise();
  }
}
