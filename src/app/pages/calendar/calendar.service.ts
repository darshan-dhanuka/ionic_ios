import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CALENDARTAB } from 'src/app/helper/constant';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  baseurl: string;
  constructor(public http: HttpClient) {
    this.baseurl = environment.baseUrl;
  }

  public async getTab() {
    const value = "";
    return await this.http.post(this.baseurl + CALENDARTAB, value).toPromise();
   
  }

  

}
