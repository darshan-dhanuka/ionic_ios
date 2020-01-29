import { Component, Output, EventEmitter } from '@angular/core';
import videojs from '../../../assets/play.es.js';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as $ from "jquery";
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/toast.service';
import { OttSingleService } from './ott-single.service';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
@Component({
  selector: 'app-ott-single',
  templateUrl: './ott-single.page.html',
  styleUrls: ['./ott-single.page.scss'],
})
export class OttSinglePage {
  title = 'player-sdk';
  isPlaying = false;
  key: any;
  iv: any;
  decrypted: any;
  encrypted: any;
  plainText: any;
  cipherText: any;
  userAgent: any;
  interVal: any;
  player: any;
  time = 0;
  subTitle: any = [];
  authorization: any;
  apiHeaders: any;
  slug: any;
  video: any;
  video_name: string;
  video_id: any;
  description: string;
  @Output() playing = new EventEmitter();
  constructor(private http: HttpClient,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar,
    private route: ActivatedRoute, private toastService: ToastService, private ottsingleservice: OttSingleService, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.slug = params['slug'];
      this.description = params['description'];
      this.getVideo(this.slug);
      this.getTab();
    });
  }
  tabs: any = [];
  ngOnInit() {
    //this.getTab();
  }
  ionViewWillEnter() {
    if (this.player) {
      this.player.on();
    }
    setInterval(function () {
      let floorElements = document.getElementsByClassName("skip-forward") as HTMLCollectionOf<HTMLElement>;
      if (floorElements) {
        floorElements[0].style.display = 'none';
      }
      let floorElements2 = document.getElementsByClassName("skip-back") as HTMLCollectionOf<HTMLElement>;
      if (floorElements2) {
        floorElements2[0].style.display = 'none';
      }
    }, 3000);
  }
  ionViewWillLeave() {
    if (this.player) {
      this.player.pause();
    }
  }
  public technologies: Array<{ thumbnail_image: string, description: string, video_category_name: string, slug: string, title: string }> = [];
  public technologies_rev: Array<{ thumbnail_image: string, description: string, video_category_name: string, slug: string, title: string }> = [];
  async getTab() {
    if (this.toastService.checkNetwork()) {
      let loading = await this.toastService.presentLoading();
      let data: any = {};
      let flag: string = '0';
      this.technologies.length = 0;
      this.ottsingleservice.getCategoryVideos("poker").then((data) => {
        console.log(data);
      })
      this.ottsingleservice.getVideos().then((data: any) => {
        loading.dismiss();
        console.log(data);
        if (data.status == 'success') {
          this.tabs = data.response;
          for (const item of data.response.videos.data) {
            if (item.slug != this.slug) {
              this.technologies.push(
                {
                  video_category_name: item.video_category_name.toString().toLowerCase(),
                  thumbnail_image: item.thumbnail_image,
                  description: item.description,
                  slug: item.slug,
                  title: item.title,
                }
              )
            }
          }
        }
      }).catch(e => {
        loading.dismiss();
        this.toastService.presentToast("Internal server error");
      });;
    }
  }
  viewVideo(slug, description) {
    this.router.navigateByUrl('home/tabs/ott-single?slug=' + slug + '&description=' + description);
  }

  decrypt() {
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(this.video.passphrase)
    });
    this.decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      CryptoJS.enc.Hex.parse(environment.crypto_key),
      {
        keySize: 256,
        iv: CryptoJS.enc.Hex.parse(environment.crypto_iv),
        mode: CryptoJS.mode.CBC
      }
    );
    const change = this.decrypted.toString(CryptoJS.enc.Utf8);
    this.plainText = parseInt(this.hexToBinary(change), 10);
    this.incrementInterVal();
  }

  hexToBinary(num) {
    const hex = num,
      bytes = [];
    for (let i = 0; i < hex.length - 1; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return String.fromCharCode.apply(String, bytes);
  }

  binaryToHex(num) {
    let str = '',
      i = 0;
    const tmp_len = num.length;
    let c;
    for (; i < tmp_len; i += 1) {
      c = num.charCodeAt(i);
      str += this.d2h(c);
    }
    return str;
    // return parseInt(num, 2).toString(16);
  }

  d2h(d) {
    return d.toString(16);
  }

  incrementInterVal() {
    this.interVal = setInterval(
      function () {
        this.plainText += 1;
      }.bind(this),
      1000
    );
    this.setPlayerConfig();
  }

  setPlayerConfig() {
    const getVideo = document.getElementById('videos');
    videojs.Hls.xhr.beforeRequest = options => {
      options.headers = [];
      options.headers['Title'] = this.encrypt();
    };
    this.userAgent = window.navigator.userAgent;
    if (this.userAgent.match(/iPad/i) || this.userAgent.match(/iPhone/i)) {
      this.player = videojs(getVideo, {
        playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 2],
        controls: true,
        preload: 'auto',
        fluid: true,
        autoplay: false,
        // tracks: this.setTracks(),
        plugins: {
          hlsQualitySelector: {},
          keyboardShortCuts: {},
          spriteThumbnails: {}
        }
      });
    } else {
      this.player = videojs(getVideo, {
        playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 2],
        controls: true,
        preload: 'auto',
        fluid: true,
        autoplay: false,
        html5: {
          nativeAudioTracks: false,
          nativeVideoTracks: false,
          nativeTextTracks: false,
          hls: {
            overrideNative: true,
            customDrm: {
              // tslint:disable-next-line:max-line-length
              keys:
                // tslint:disable-next-line: max-line-length
                'MjMyOGMwYWM4MmNhM2ZjNmY4ZDcyNzI0NWQzMDgzYmUxMzU3ZjA0NGZmNWNiNGMzYTExNDJiMDkzY2YyZjNjOTAwNTM0MjE4NTUxMmM5ODlhMWYwMzI3YjQwYmY3YmY1YjE2MDBkMTYzYTA1ZTFkYzE4OWJhMjUwOGM1MTIwODksNDg3MGVjMDY0YzEwODE0MmNjMGZmYmQ2ZmZkZjFlMDhlNzU2YTZkZWYyYzc4MDQ2ODlmZTRhZTBmYzk4NTIyMSxiMmJmNWE5NzAwNGJiMzFkNmY1YTljMmM4NDQ0OTc1OQ'
            }
          }
        },
        // tracks: this.setTracks(),
        plugins: {
          hlsQualitySelector: {},
          seekButtons: {
            forward: 10,
            back: 10
          },
          keyboardShortCuts: {},
          spriteThumbnails: {}
        }
      });
    }
    this.player.on('adsready', () => {
      this.player.play();
    });

    this.player.on('adserror', () => {
      this.player.play();
    });
    this.player.on('fullscreenchange', (e) => {
      debugger
      if (this.player.isFullscreen()) {
        this.statusBar.backgroundColorByHexString('#000000');
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      } else {
        this.statusBar.backgroundColorByHexString('#ffffff');
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      }
    });
    this.setPlayer(this.video);
  }

  encrypt() {
    const utf8 = CryptoJS.enc.Utf8.parse('vplayed/' + this.plainText);
    const hex_utf = utf8.toString(CryptoJS.enc.Utf8);
    const hex = this.binaryToHex(hex_utf);
    this.encrypted = CryptoJS.AES.encrypt(
      hex,
      CryptoJS.enc.Hex.parse(environment.crypto_key),
      {
        keySize: 256,
        iv: CryptoJS.enc.Hex.parse(environment.crypto_iv),
        mode: CryptoJS.mode.CBC
      }
    );
    this.cipherText = this.encrypted.ciphertext.toString(CryptoJS.enc.utf8);
    return this.cipherText;
  }

  setPlayer(video) {
    this.video = video;
    document.getElementsByClassName('play-text-track-display')[0].innerHTML =
      '<div>' + video.title + '</div>';
    $('#ogImage').attr('content', video.poster_image);
    this.player.on('play', () => {
      //  const socket = new WebSocket(environment.socketUrl);
      //   socket.onopen = (event) => {
      //     socket.send('1');
      //   };
    });




    // if (!video.ads_url) {
    //   this.player.play();
    // }
    this.player.autoplay(true);
    this.player.src({ //pass the video src instead of the following video string dynamically.
      src: video.hls_playlist_url,
      type: 'application/x-mpegURL'
    });

    /** Check last video session */
    const session = JSON.parse(localStorage.getItem('videos'));
    if (
      session &&
      typeof session['hls_playlist_url'] !== 'undefined' &&
      typeof video.hls_playlist_url !== 'undefined' &&
      session['hls_playlist_url'] === video.hls_playlist_url
    ) {
      this.player.currentTime(session['currentTime']);
    } else {
      this.player.currentTime(0);
    }
    this.player.on('pause', () => {
      // const socket = new WebSocket(environment.socketUrl);
      // socket.onopen = (event) => {
      //   socket.send('0');
      // };
    });
    /** Video playing */
    this.player.on('playing', () => {
      if (!this.isPlaying) {

        this.isPlaying = true;
        this.playing.emit(false);
        this.player.spriteThumbnails({
          url: video.sprite_image,
          width: 192,
          height: 113,
          stepTime: 20
        });
      }
    });
    setInterval(
      function () {
        if ($('.play-control-bar').css('opacity') === '1') {
          $('.back_btn').css('display', 'block');
          $('.movie-title').css('display', 'block');
        } else {
          $('.back_btn').css('display', 'none');
          $('.movie-title').css('display', 'none');
        }
      }.bind(this),
      1
    );
    /** Video current time update */
    this.player.on('timeupdate', () => {
      this.time = this.player.currentTime();
      video.currentTime = this.time;
      localStorage.setItem('videos', JSON.stringify(video));
    });

    this.player.on('modelClose', () => {
      $('.video-player-center').removeClass('rem-name');
      $('.video-cs-blk').show();
    });
    this.player.on('modelOpen', () => {
      $('.video-player-center').addClass('rem-name');
      $('.video-cs-blk').hide();
    });
    /** Video Error */
    this.player.on('error', event => {
      if (
        this.player.error().status === 403 ||
        this.player.error().status === 404 ||
        this.player.error().code === 4
      ) {
        if (video.is_live === 1) {
          $('.play-error-display').removeClass('play-hidden');
          let getMessage;
          getMessage = "Live Not Started";
          $('.play-modal-dialog-content').html(getMessage);
          this.player.reset();
        } else {
          $('.play-error-display').removeClass('play-hidden');
          let getMessage;
          getMessage = "Video Not Found";
          $('.play-modal-dialog-content').html(getMessage);
          this.player.reset();
        }
      }
      if (this.player.error().code === 2) {
        if (video.is_live === 1) {
          $('.play-error-display').removeClass('play-hidden');
          let getMessage;
          getMessage = "Live Not Started";
          $('.play-modal-dialog-content').html(getMessage);
          this.player.reset();
        } else {
          $('.play-error-display').removeClass('play-hidden');
          let getMessage;
          getMessage = "Video Not Found";
          $('.play-modal-dialog-content').html(getMessage);
          this.player.reset();
        }
      }
      if (this.player.error().code === 3) {
        $('.play-error-display').removeClass('play-hidden');
        let getMessage;
        getMessage = "Stream Not Supported";
        $('.play-modal-dialog-content').html(getMessage);
        this.player.reset();
      }
      if (this.player.error().code === 5) {
        $('.play-error-display').removeClass('play-hidden');
        let getMessage;
        getMessage = "Something Went Wrong. Please try again!";
        $('.play-modal-dialog-content').html(getMessage);
        this.player.reset();
      }
    });

    /** Video End */
    this.player.on('ended', () => {
      this.isPlaying = false;
      video.currentTime = 0;
      localStorage.setItem('videos', JSON.stringify(video));
    });

    this.player.on('progressWidth', e => {
    });
  }

  // setTracks() {
  //   if (this.video.subtitle) {
  //     if (this.video.subtitle.subtitle_list.length > 0) {
  //       this.video.subtitle.subtitle_list.forEach(element => {
  //         this.subTitle.push({
  //           title: 'subtitles',
  //           kind: 'subtitles',
  //           language: element.language,
  //           label: element.label,
  //           src: this.video.subtitle.base_url + element.url,
  //           default: element.default
  //         });
  //       });
  //       this.subTitle.push({});
  //     }
  //     return this.subTitle;
  //   } else {
  //     return [];
  //   }
  // }


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

  callGetAPI(url: string) {
    return this.http.get<any>(environment.apiUrl + url, this.headers())
      .pipe(map(
        data => {
          return data;
        }
      ));
  }

  getVideo(slug_txt) {

    const url = 'v2/watchvideo/';
    //pass the video slug instead of the string below. This is our vplayed video slug. You should pass your video slug
    this.callGetAPI(url + slug_txt)
      .subscribe(
        data => {
          console.log(data);
          this.video = data['response'].videos;


          if (data['status'] == 'success') {
            this.video_name = this.video.title;
            this.video_id = this.video.slug;
            this.decrypt();
          }
        });
  }
}
