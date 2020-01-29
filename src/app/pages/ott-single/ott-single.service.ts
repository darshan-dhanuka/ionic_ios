import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HOMETAB, HOMENEWS } from 'src/app/helper/constant';

@Injectable({
  providedIn: 'root'
})
export class OttSingleService {
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
    return this.http.post(this.baseurl + 'v2/videos', this.headers()).toPromise();
  }

  public async getCategoryVideos(category) {
    return this.http.get(this.baseurl + 'v2/home_category_videos?is_web_series=0&category=' + category, this.headers()).toPromise();
  }

  public async getHomeNews() {
    return this.http.get(this.baseurl + HOMENEWS).toPromise();
  }

}
