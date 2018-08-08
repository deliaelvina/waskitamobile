import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { Http } from '@angular/http';
import { environment } from '../../environment/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'walkthrough-page',
  templateUrl: 'walkthrough.html'
})
export class WalkthroughPage {

  lastSlide = false;
  url_api = environment.Url_API;

  @ViewChild('slider') slider: Slides;

  constructor(public nav: NavController, private http:Http, private _sanitize:DomSanitizer) {
    // this.loadPict();
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
    this.nav.push(SignupPage);
  }

  loadPict(){
    this.http.get(this.url_api + "c_iFrame/getPict")
    .subscribe((data) => {
      var x = data.json();
      if(x.length > 0){
        var i = 0;
        x.forEach(val => {
          this.pict.push(this._sanitize.bypassSecurityTrustResourceUrl(val));
          i++;
        });
      }
      else {
        // this._app.getRootNav().setRoot(LoginPage);
        this.nav.setRoot(LoginPage);
      }
    });
  }
}
