import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USERLEVEL } from 'src/app/helper/constant';

@Injectable({
  providedIn: 'root'
})
export class UserLevelService {
  baseurl: string;
  constructor(public http: HttpClient) { 
    this.baseurl = environment.baseUrl;
  }

  public async setLevel(page: any, size: any) {
    return this.http.get(this.baseurl + USERLEVEL + "?email=" + page + "&button_value=" + size).toPromise();
  }
}
