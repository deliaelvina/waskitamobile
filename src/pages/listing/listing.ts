import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController,Platform,MenuController,App } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import { ProjectPage } from '../projectInfo/project';
import { ReservationProjectPage } from '../reservation/project';
import { NewsPage } from '../NewsAndPromo/news';
import { PromoPage } from '../NewsAndPromo/promo';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ListingModel } from './listing.model';
import { ListingService } from './listing.service';
import { LoginPage } from '../login/login';
import { ProductProjectPage } from '../productInfo/project';
import { ContactPage } from '../productInfo/contact/contact';
import { ReservationReservePage } from '../reservation/reserve';
import { MyReservationProjectPage } from '../reservation/myReservation';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { CameraPage } from '../camera/camera';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { environment } from '../../environment/environment';
import { BookingPage } from '../booking/project';
import { MyUnitPage } from '../MyUnit/myUnit';
import { SimulasiPage } from '../simulasi/simulasi';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';
import { ListingProjectPage } from './project';
import { ProjectDownloadPage } from '../download/project';
import { UnitEnquiryProjectPage } from '../unitEnquiryMenu/project';
// import { ProjectDownloadPage } from '../download/project';

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
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  ErrorList:any;
  url_api = environment.Url_API;

  constructor(
    public nav: NavController,
    public listingService: ListingService,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public alertCtrl: AlertController,
    public platform: Platform,
    private _errorService: ErrorhandlerService,
    private http: HttpClient,
    private menu: MenuController,
    private _app: App,
    private _authService: AuthService,
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
    this.link['UnitEnquiryProjectPage'] = UnitEnquiryProjectPage;
    this.link['MyUnitPage'] = MyUnitPage;
    this.link['SimulasiPage'] = SimulasiPage;
    this.link['ProjectPage'] = ProjectPage;
    this.link['ReservationProjectPage'] = ReservationProjectPage;
    this.link['NewsPage'] = NewsPage;
    this.link['PromoPage'] = PromoPage;
    this.link['ProductProjectPage'] = ProductProjectPage;
    this.link['MyReservationProjectPage'] = MyReservationProjectPage;
    this.link['ListingProjectPage'] = ListingProjectPage;
    this.link['ProjectDownloadPage'] = ProjectDownloadPage;
    this.link['BookingPage'] = BookingPage;
    this.loading = this.loadingCtrl.create();
  }

  // initDash() {
  ionViewDidLoad() {
    // this.loading.present();
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
    // this.loading.dismiss();
  }

  ionViewDidEnter(){
    localStorage.removeItem('menus');
    localStorage.removeItem('data');
  }

  ionViewWillEnter(){
    localStorage.removeItem('menus');
    localStorage.removeItem('data');
    this.banner_title = localStorage.getItem("Name");
  }

  ionViewWillLeave(){
    localStorage.removeItem('menus');
    localStorage.removeItem('data');
  }

  ionViewDidLeave(){
    localStorage.removeItem('menus');
    localStorage.removeItem('data');
  }

  logout() {
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
            sessionStorage.setItem("Token", localStorage.getItem('Token'));
            this.loading = this.loadingCtrl.create();
            this.loading.present().then(() => {
              this.logoutAPi();
            });
          }
        }
      ]
    });
    alertA.present();
  }

  //copy utk logout
  logoutAPi(){
    this.loading.present();
    let UserId = localStorage.getItem('UserId');
    this._authService.logout().subscribe(
      (x:any) => {
        // console.log(x);
              if(x.Error == true) {
                  // this.showAlert("Warning!", x.Pesan);
                  this.loading.dismiss();
                  localStorage.clear();
                  if(this.device=='android'){
                      navigator['app'].exitApp();
                  }else{//ios and web
                      this._app.getRootNav().setRoot(MyApp);
                  }
              }
              else {
                this.loading.dismiss();
                localStorage.clear();
                  if(this.device=='android'){
                      navigator['app'].exitApp();
                  }else{//ios and web
                      this._app.getRootNav().setRoot(MyApp);
                  }
              }
            },
            (err)=>{
              this.loading.dismiss();
              //filter error array
              this.ErrorList = this.ErrorList.filter(function(er){
                  return er.Code == err.status;
              });

              var errS;
              if(this.ErrorList.length == 1 ){
                errS = this.ErrorList[0].Description;
              }else{
                errS = err;
              }
                this.showAlert("Error!", errS);

                this.loading.dismiss();
                  localStorage.clear();
                  if(this.device=='android'){
                      navigator['app'].exitApp();
                  }else{//ios and web
                      this._app.getRootNav().setRoot(MyApp);
                  }
            }
            
    );
  }

  goToFeed(category: any) {
    // console.log(category);
    let a = this.link[category.link];

    this.nav.push(a, { category: category, user: localStorage.getItem("UserId") });
  }

  // goToTest(){
  //   // alert('a');
  //   this.nav.push(ListingProjectPage, { user: localStorage.getItem("UserId") });
  // }

  // goToDownload(){
  //   this.nav.push(ProjectDownloadPage, { user: localStorage.getItem("UserId") });
  // }

  showAlert(title:any, subTitle:any) {

    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : title,
      subTitle : subTitle,
      buttons : [
        {text : 'Ok', handler: () => {
          this.nav.pop();
        }}
      ]
    });

    warning.present();
  }

}
