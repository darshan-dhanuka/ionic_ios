import { Component, OnInit } from '@angular/core';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Platform,AlertController } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { Router } from "@angular/router";
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher/ngx';

const options: AppLauncherOptions = {packageName:'com.psl.practicepoker'}
declare let unityARCaller: any;

@Component({
  selector: 'app-learn',
  templateUrl: './learn.page.html',
  styleUrls: ['./learn.page.scss'],
  providers: [AppLauncher,AppAvailability,InAppBrowser],
})
export class LearnPage implements OnInit {

  constructor(private platform:Platform,private appAvailability:AppAvailability,private alertCtrl: AlertController,private iab:InAppBrowser, private router:Router,private appLauncher: AppLauncher) { 
    
  }
  
  openUnity() {
		alert("dsfdsfds");
		// It is possible to send a string message to Unity-side (optional)
		unityARCaller.launchAR( "my message for Unity-side", this.uReturnedFromUnity, this.uMessageReceivedFromUnity );
	}
	
	sendMessageToUnity() {
		// Send a message to Unity while Unity is still running
		unityARCaller.sendMessage( "Function name", "Optional parameter" );
	}
	
	uReturnedFromUnity = (param) => {
		// param:String is the (optional) message returned from Unity-side
		alert( param );
	};
	
	uMessageReceivedFromUnity = (message) => {
		// message:String is the message received from Unity-side
		// If you call a UI-blocking function here like 'alert', subsequent messages from Unity
		// will be queued by the OS and will only be received after returning to Ionic and
		// unblocking the UI
		console.log( "=========" + message + "=========" );
	};

  ngOnInit() {
    //this.launchExternalApp('com.psl.practicepoker','com.psl.practicepoker','com.psl.practicepoker.UnityPlayerActivity','http://15.206.187.126/apk/PokerSimulatorV1.3.apk','http://15.206.187.126/apk/PokerSimulatorV1.3.apk');  
  }
  ionViewWillEnter(){

  }
  launchExternalApp(){
    //alert("dsadas");
    
  }
  
    

}
