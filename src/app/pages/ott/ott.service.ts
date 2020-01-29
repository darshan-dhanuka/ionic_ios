import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HOMETAB, HOMENEWS } from 'src/app/helper/constant';

@Injectable({
  providedIn: 'root'
})
export class OttService {
  baseurl: string;
  apiHeaders: any;
  constructor(public http: HttpClient) {
    this.baseurl = environment.apiUrl;
  }
  headers = () => {
    this.apiHeaders = new HttpHeaders();
    this.apiHeaders.headers['Accept'] = 'application/json';
    this.apiHeaders.headers['X-REQUEST-TYPE'] = 'web';
    if (localStorage.getItem('currentLanguage')) {
      this.apiHeaders.headers['X-LANGUAGE-CODE'] = localStorage.getItem('currentLanguage');
    } else {
      this.apiHeaders.headers['X-LANGUAGE-CODE'] = 'en';
    }
    // if (this.authorization.hasOwnProperty('response')) {
    //   this.apiHeaders.headers['Authorization'] = 'Bearer ' + this.authorization.response.access_token;
    // }
    return this.apiHeaders;
  }
  public async getVideos() {
    return this.http.post(this.baseurl + 'v2/videos?page=1',this.headers()).toPromise();
  }
  public async getVideos2() {
    return this.http.post(this.baseurl + 'v2/videos?page=2',this.headers()).toPromise();
  }

  public async getHomeNews() {
    return this.http.get(this.baseurl + HOMENEWS).toPromise();
  }

}
