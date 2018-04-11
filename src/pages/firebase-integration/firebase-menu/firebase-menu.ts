import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FirebaseFeedPage } from '../firebase-feed/firebase-feed';
import { FirebaseFacebookLoginPage } from '../firebase-facebook-login/firebase-facebook-login';

@Component({
  selector: 'firebase-menu-page',
  templateUrl: 'firebase-menu.html'
})
export class FirebaseMenuPage {
  items: Array<{title: string, note?: string, component: any}>;

  constructor(public nav: NavController) {}

  ionViewWillEnter(){
    this.items = [
      { title: 'CRUD and filter options', component: FirebaseFeedPage },
      { title: 'Facebook Login', component: FirebaseFacebookLoginPage },
    ];
  }

  itemTapped(event, item) {
    this.nav.push(item.component);
  }
}
