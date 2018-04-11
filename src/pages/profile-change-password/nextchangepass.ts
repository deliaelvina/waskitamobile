import { Component } from '@angular/core';
import { MenuController, NavParams ,App} from 'ionic-angular';
// import { UserModel } from '../profile/profile.model';
// import { NextChangePasswordPage} from './nextchangepass';
@Component({
    selector: 'next-change-password-page',
    templateUrl: 'nextchangepass.html'
  })
  export class NextChangePasswordPage {
    // list: Array<UserModel> = [];
  
    constructor(public menu: MenuController, public navParams: NavParams,public app: App)
    {
    //   this.list = navParams.get('list');
    }

    ubahpassword(){
      alert('password diubah');
    }

    // nextchange(){
    //   this.menu.close();
    // this.app.getRootNav().push(NextChangePassword);
    // }
  
    // ionViewDidEnter() {
    //   // the root left menu should be disabled on this page
    //   this.menu.enable(false);
    // }
  
    // ionViewWillLeave() {
    //   // enable the root left menu when leaving the tutorial page
    //   this.menu.enable(true);
    // }
  }