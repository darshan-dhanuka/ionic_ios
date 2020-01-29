import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from 'src/app/toast.service';
import { LeaderboardService } from './leaderboard.service';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {
  @ViewChild(IonInfiniteScroll,{static: true}) infiniteScroll: IonInfiniteScroll;
 
 
  dataList:any;
  public leaderboardData;
  public name;
  public teams;
  public category;
  public points;
  public ranking;
  public overallranking;
  config: any;
  collection = { count: 60, data: [] };
  tabs: any = [];
  date_lb: string;
  constructor(private toastService: ToastService,private leaderboardService: LeaderboardService) { 
    this.dataList = []
  }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.getTab();
  }
  async getTab() {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      let data: any = {};
      this.leaderboardService.getVideos().then((data: any) => {
        loading.dismiss();
        //console.log(data);
        if (data.errorcode == '0') {
          this.tabs = data.response;
		  this.date_lb = data.date;
          for (const item of data.result) {
            this.dataList.push(
              {
                
                player: item.player,
                category: item.category,
                points: item.points,
                stworank: item.stworank,
                overallrank: item.ranking,
              }
            )
          }
        }
        
        //console.log(this.collection);
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });;
    }
  }
  loadData(event) {
    
    setTimeout(() => {
      if (this.dataList.length >= 50) {
        event.target.disabled = true;
      }else{
        this.getTab();
      }
     
    }, 500);
  }
}
