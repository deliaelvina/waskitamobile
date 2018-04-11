import { Component } from '@angular/core';
import { NavController, LoadingController, Platform } from 'ionic-angular';
import { FirebaseFacebookLoginService } from './firebase-facebook-login.service';
import { FirebaseFacebookUserModel } from './firebase-facebook-user.model';

@Component({
  selector: 'firebase-facebook-login-page',
  templateUrl: 'firebase-facebook-login.html'
})
export class FirebaseFacebookLoginPage {
  user: FirebaseFacebookUserModel;
  loading: any;

  constructor(
    public nav: NavController,
    public firebaseFacebookLoginService: FirebaseFacebookLoginService,
    public loadingCtrl: LoadingController,
    public platform: Platform
  ) {
    this.loading = this.loadingCtrl.create();
    this.user = new FirebaseFacebookUserModel();
  }

  ionViewDidLoad(){

    if(this.platform.is('cordova')){

      this.loading.present();

      this.firebaseFacebookLoginService.getFacebookUser()
      .then((user) => {
        this.user = user;
        this.loading.dismiss();
      }, (error) => {
        console.log(error);
        this.user = new FirebaseFacebookUserModel();
        this.loading.dismiss();
      });
    } else {
      console.log("Cordova not available");
    }

  }

  doFacebookLogout(){
    this.firebaseFacebookLoginService.doFacebookLogout()
    .then((res) => {
      this.user = new FirebaseFacebookUserModel();
    }, (error) => {
      console.log("Facebook logout error", error);
    });
  }

  doFacebookLogin() {
    this.firebaseFacebookLoginService.doFacebookLogin()
    .then((user) => {
      this.user = user;
    }, (err) => {
      console.log("Facebook Login error", err);
    });
  }
}
