import { Component, OnInit, ViewChild } from '@angular/core';
import { OttService } from './ott.service';
import { ToastService } from 'src/app/toast.service';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-ott',
  templateUrl: './ott.page.html',
  styleUrls: ['./ott.page.scss'],
})
export class OttPage implements OnInit {
  @ViewChild('technologiesSlides', null) technologiesSlides: IonSlides;
  @ViewChild('technologies_wwudoSlides', null) technologies_wwudoSlides: IonSlides;
  @ViewChild('technologies_wdtdoSlides', null) technologies_wdtdoSlides: IonSlides;
  constructor(private toastService: ToastService, private ottservice: OttService, private router: Router) { }
  tabs: any = [];

  ngOnInit() {
    this.getTab();
  }


  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: {
      disableOnInteraction: false
    },
    speed: 1000,

  };
  slideOptsVideo = {
    initialSlide: 0,
    slidesPerView: 2,
    spaceBetween: 18,
    autoplay: false,
    speed: 1000,
  };

  technologiesNext() {
    this.technologiesSlides.slideNext();
  }
  technologiesPrev() {
    this.technologiesSlides.slidePrev();
  }

  technologies_wwudoSlidesNext() {
    this.technologies_wwudoSlides.slideNext();
  }
  technologies_wwudoSlidesPrev() {
    this.technologies_wwudoSlides.slidePrev();
  }

  technologies_wdtdoSlidesNext() {
    this.technologies_wdtdoSlides.slideNext();
  }
  technologies_wdtdoSlidesPrev() {
    this.technologies_wdtdoSlides.slidePrev();
  }

  public technologies: Array<{ thumbnail_image: string, video_duration: string, description: string, video_category_name: string, slug: string, title: string }> = [];
  public technologies_wwudo: Array<{ thumbnail_image: string, video_duration: string, description: string, video_category_name: string, slug: string, title: string }> = [];
  public technologies_wdtdo: Array<{ thumbnail_image: string, video_duration: string, description: string, video_category_name: string, slug: string, title: string }> = [];
  async getTab() {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      let data: any = {};
      this.ottservice.getVideos().then((data: any) => {
        loading.dismiss();
        console.log(data);
        if (data.status == 'success') {
          this.tabs = data.response;
          for (const item of data.response.videos.data) {
            if (item.video_category_name == 'PSL Season 2') {
              this.technologies.push(
                {
                  video_category_name: item.video_category_name.toString().toLowerCase(),
                  thumbnail_image: item.thumbnail_image,
                  description: item.description,
                  slug: item.slug,
                  title: item.title,
                  video_duration: item.video_duration
                }
              )
            } else if (item.video_category_name == 'what would you do') {
              this.technologies_wwudo.push(
                {
                  video_category_name: item.video_category_name.toString().toLowerCase(),
                  thumbnail_image: item.thumbnail_image,
                  description: item.description,
                  slug: item.slug,
                  title: item.title,
                  video_duration: item.video_duration
                }
              )
            } else if (item.video_category_name == 'what did they do') {
              this.technologies_wdtdo.push(
                {
                  video_category_name: item.video_category_name.toString().toLowerCase(),
                  thumbnail_image: item.thumbnail_image,
                  description: item.description,
                  slug: item.slug,
                  title: item.title,
                  video_duration: item.video_duration
                }
              )
            }
          }
        }
        console.log("techno : " + this.technologies[0]);
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });;
      this.ottservice.getVideos2().then((data: any) => {
        loading.dismiss();
        if (data.status == 'success') {
          this.tabs = data.response;
          for (const item of data.response.videos.data) {
            if (item.video_category_name == 'PSL Season 2') {
              this.technologies.push(
                {
                  video_category_name: item.video_category_name.toString().toLowerCase(),
                  thumbnail_image: item.thumbnail_image,
                  description: item.description,
                  slug: item.slug,
                  title: item.title,
                  video_duration: item.video_duration

                }
              )
            } else if (item.video_category_name == 'what would you do') {
              this.technologies_wwudo.push(
                {
                  video_category_name: item.video_category_name.toString().toLowerCase(),
                  thumbnail_image: item.thumbnail_image,
                  description: item.description,
                  slug: item.slug,
                  title: item.title,
                  video_duration: item.video_duration
                }
              )
            } else if (item.video_category_name == 'what did they do') {
              this.technologies_wdtdo.push(
                {
                  video_category_name: item.video_category_name.toString().toLowerCase(),
                  thumbnail_image: item.thumbnail_image,
                  description: item.description,
                  slug: item.slug,
                  title: item.title,
                  video_duration: item.video_duration
                }
              )
            }
          }
        }
        console.log(this.technologies);
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });;
    }
  }
  viewVideo(slug, description) {
    this.router.navigateByUrl('home/tabs/ott-single?slug=' + slug + '&description=' + description);
  }
}
