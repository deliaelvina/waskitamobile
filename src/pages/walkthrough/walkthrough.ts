import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, AlertController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Http } from '@angular/http';
import { environment } from '../../environment/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { SignupOptPage } from '../signup/signupoption';

@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  lastSlide = false;
  url_api = environment.Url_API;
  loading:any;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController, private http:Http, private _sanitize:DomSanitizer, private hclient:HttpClient,public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
  ) {
    // this.loadPict();
    this.loading = loadingCtrl.create();
  }
  pict:any[]=[];
  logo:any[]=[
    this.url_api+"images/logo.png"
  ]

  ionViewDidLoad() {
    this.loadPict();
  }

  skipIntro() {
    // You can skip to main app
    // this.nav.setRoot(TabsNavigationPage);

    // Or you can skip to last slide (login/signup slide)
    this.lastSlide = true;
    this.slider.slideTo(this.slider.length());
  }

  onSlideChanged() {
    // If it's the last slide, then hide the 'Skip' button on the header
    this.lastSlide = this.slider.isEnd();
  }

  goToLogin() {
    this.nav.push(LoginPage);
  }

  goToSignup() {
    this.nav.push(SignupOptPage);
  }

  showAlert(title:any, subTitle:any) {

    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : title,
      subTitle : subTitle,
      buttons : [
        {text : 'Try Again', handler: () => {
          // this.nav.pop();
          this.loading = this.loadingCtrl.create();
          this.loading.present();
          this.loadPict();
        }}
      ]
    });

    warning.present();
  }

  loadPict(){
    this.hclient.get(this.url_api + "c_iFrame/getPict")
    .subscribe((data) => {
      this.loading.dismiss();
      var x = data;
      // alert('S => '+JSON.stringify(x));
      if(Object.keys(x).length > 0){
        var i = 0;
        Object.keys(x).forEach(val => {
          // this.pict.push(this._sanitize.bypassSecurityTrustResourceUrl(val));
          this.pict.push(x[val]);
          i++;
        });
      }
      else {
        // alert('ahelah');
        // this._app.getRootNav().setRoot(LoginPage);
        this.nav.setRoot(LoginPage);
      }
    },(err) => {
      this.loading.dismiss();
      this.showAlert('Error!', 'Please Check Your Connection');
      // alert('E => '+JSON.stringify(err));
    });
  }
}
