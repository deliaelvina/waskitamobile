import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController,Platform } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import { ProjectPage } from '../projectInfo/project';
import { ReservationProjectPage } from '../reservation/project';
import { NewsPage } from '../NewsAndPromo/news';
import { PromoPage } from '../NewsAndPromo/promo';
import 'rxjs/Rx';

import { ListingModel } from './listing.model';
import { ListingService } from './listing.service';
import { LoginPage } from '../login/login';
import { ProductProjectPage } from '../productInfo/project';
import { ContactPage } from '../productInfo/contact/contact';
import { ReservationReservePage } from '../reservation/reserve';
import { MyReservationProjectPage } from '../reservation/myReservation';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { CameraPage } from '../camera/camera';

@Component({
  selector: 'listing-page',
  templateUrl: 'listing.html',
})
export class ListingPage {
  // listing: ListingModel = new ListingModel();
  loading: any;
  picturee = {
    'project':"./assets/images/dashPict/list.png",
    'reservasi' : "./assets/images/dashPict/news.png"
  };
  rootPage: any = LoginPage;

  dashMenu: any[] = [];
  banner_image: string = "./assets/images/listing/dashboard.jpg";
  banner_title: string = "Welcome Haniyya Deska Akmal";

  link: any[] = [];
  img:any[] = [];
  device:string;
  constructor(
    public nav: NavController,
    public listingService: ListingService,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public alertCtrl: AlertController,
    public platform: Platform,
  ) {
    platform.ready().then((source) => {
      if (this.platform.is('android')) {
        localStorage.setItem('Device', 'android');
        this.device = 'android';
        // alert("running on Android device!");
      }
      if (this.platform.is('ios')) {
        this.device = 'iOS';
        localStorage.setItem('Device', 'iOS');
      }
      if (this.platform.is('mobileweb')) {
        this.device = 'web';
        localStorage.setItem('Device', 'web');
      }
      // alert(source);
    });
    // this.initDash();
    this.link['ProjectPage'] = ProjectPage;
    this.link['ReservationProjectPage'] = ReservationProjectPage;
    this.link['NewsPage'] = NewsPage;
    this.link['PromoPage'] = PromoPage;
    this.link['ProductProjectPage'] = ProductProjectPage;
    this.link['MyReservationProjectPage'] = MyReservationProjectPage;
    this.loading = this.loadingCtrl.create();
  }

  // initDash() {
  ionViewDidLoad() {
    this.loading.present();
    var pict = '';
    var menu = JSON.parse(localStorage.getItem("MenuDash"));
    // this.banner_title = localStorage.getItem("UserId");
    this.banner_title = localStorage.getItem("Name");
    menu.forEach(data => {
      pict = 'default.png';
      if(data.picture != '' && data.picture != null) {
        pict = data.picture;
      }
      this.dashMenu.push({
        image : "./assets/images/dashPict/"+pict,
        title : data.Title,
        link : data.URL_angular,
      });
    });

    // console.log(this.dashMenu);
    this.loading.dismiss();
  }

  logout() {
    // navigate to the new page if it is not the current page
    // if(confirm("Are you sure want to logout?")){
    //   // this.nav.setRoot(this.rootPage);
    //   window.location.reload(true);
    //   // localStorage.removeItem("isLogin");
    //   // localStorage.removeItem('MenuDash');
    //   // localStorage.removeItem('Group');
    //   // localStorage.removeItem('UserId');
    //   // localStorage.removeItem('Token');
    //   // localStorage.removeItem('User');
    //   localStorage.clear();
    //   if(this.device=='iOS'){

    //   }else if(this.device=='android'){
    //     navigator['app'].exitApp();
    //   }else{

    //   }

    // }
    let alertA = this.alertCtrl.create({
      title: 'Sign Out',
      message: 'Are you sure want to Sign Out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            // console.log('Buy clicked');
            localStorage.clear();
            // alert('ok');
              if(this.device=='iOS'){
                  this.platform.exitApp();
              }else if(this.device=='android'){
                  navigator['app'].exitApp();
              }else{
                this.platform.exitApp();
              }


          }
        }
      ]
    });
    alertA.present();
  }

  // ionViewDidLoad() {
  //   this.loading.present();
  //   this.listingService
  //     .getData()
  //     .then(data => {
  //       this.listing.banner_image = data.banner_image;
  //       this.listing.banner_title = data.banner_title;
  //       // this.listing.banner_title_2 = data.banner_title_2;
  //       this.listing.populars = data.populars;
  //       this.listing.categories = data.categories;
  //       this.loading.dismiss();
  //     });
  // }


  goToFeed(category: any) {
    // console.log(category);
    let a = this.link[category.link];
    // var xx:any;
    // console.log("Clicked goToFeed", category);
    // if(category.title == "My Reservation"){
    //   xx = { category: category, user: localStorage.getItem("UserId"), data: 'res' };
    // }
    // else {
    //   xx = { category: category, user: localStorage.getItem("UserId"), data: null };
    // }

    this.nav.push(a, { category: category, user: localStorage.getItem("UserId") });
  }

  // goToTest(){
  //   // alert('a');
  //   this.nav.push(MyReservationProjectPage, { user: localStorage.getItem("UserId") });
  // }

}