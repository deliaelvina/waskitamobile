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
    this.loadPict();
  }
  pict:any[]=[];
  logo:any[]=[
    "http://35.197.137.111/waskitaAPI/images/logo.png"
  ]

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
      console.log(data);
      console.log(x);
      // this.pict = data;
      var i = 0;
      x.forEach(val => {
        // console.log(val);
        // this.pict.push({
        //   'background-image':"'url("+this._sanitize.bypassSecurityTrustResourceUrl(val)+"'"
        // });
        console.log(val);
        // this.pict.push(this._sanitize.bypassSecurityTrustResourceUrl(val));
        this.pict.push(this._sanitize.bypassSecurityTrustResourceUrl(val));
      
  
        i++;
        // this.pict[] = this._sanitize.bypassSecurityTrustResourceUrl(val);
      });
    //   x.forEach(data, function(val){
    //     this.pict.push(this._sanitize.bypassSecurityTrustResourceUrl(val));
    // });
      console.log(this.pict);
    }); 
  }
}
