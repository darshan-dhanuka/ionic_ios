import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  baseurl: string;
  constructor(public http: HttpClient) { this.baseurl = environment.baseUrl; }
  public async getVideos() {
    return this.http.post(this.baseurl + 'leaderboard',{}).toPromise();
  }
}
