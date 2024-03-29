
import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController,Platform,MenuController,App } from 'ionic-angular';

import { FeedPage } from '../feed/feed';
import { ProjectPage } from '../projectInfo/project';
import { ReservationProjectPage } from '../reservation/project';
import { NewsPage } from '../NewsAndPromo/news';
import { PromoPage } from '../NewsAndPromo/promo';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ReportModel } from './report.model';
import { ReportService } from './report.service';
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
// import { ProjectDetailsPage } from '../projectInfo/projectdetails';
// import { ProductPhasePage } from '../productInfo/phase';
// import { BookingPhasePage } from '../booking/phase';
// import { DownloadPage } from '../download/download';
import { ReportNUP } from '../reportNUP/reportNUP';
import { ReportSales } from '../reportSales/reportSales';
import { ReportAgentPage } from './report_agent';
import { ReportFinance } from '../reportFinance/reportFinance';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { base64, base64Encode } from '@firebase/util';
import { Token } from '@angular/compiler';
import { noComponentFactoryError } from '@angular/core/src/linker/component_factory_resolver';


@Component({
  selector: 'report-page',
  templateUrl: 'report.html',
})
export class ReportPage {
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

  frontData : any;

  constructor(
    public nav: NavController,
    public reportService: ReportService,
    public loadingCtrl: LoadingController,
    public camera: Camera,
    public alertCtrl: AlertController,
    public platform: Platform,
    private _errorService: ErrorhandlerService,
    private http: HttpClient,
    private menu: MenuController,
    private _app: App,
    private _authService: AuthService,
    private iab :InAppBrowser,

  ) {
    this.frontData = JSON.parse(localStorage.getItem('Project'));
    // console.log(this.frontData);
    this.dashMenu = [
      {
        image : "./assets/images/dashPict/checklist.png",
        title : "Dashboard NUP",
        link : "ReportNUP"
      },
      {
        image : "./assets/images/dashPict/rgb.png",
        title : "Dashboard Sales",
        link : "ReportSales"
      },

      // {
      //   image : "./assets/images/dashPict/bar-chart.png",
      //   title : "Sales Report Agent",
      //   link : "ReportAgentPage"
      // },

    ];

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

    this.link['SimulasiPage'] = SimulasiPage;
    this.link['NewsPage'] = NewsPage;
    this.link['PromoPage'] = PromoPage;
    this.link['ReportNUP'] = ReportNUP;
    this.link['ReportSales'] = ReportSales;
    // this.link['ReportAgentPage'] = ReportAgentPage;

    this.loading = this.loadingCtrl.create();
  }

  // initDash() {
  ionViewDidLoad() {

  }

  ionViewWillEnter(){
    // localStorage.removeItem('menus');
    this.banner_title = localStorage.getItem("Name");
  }

  ionViewWillLeave(){
    // localStorage.removeItem('menus');
    localStorage.removeItem('cons_project');
  }

  ionViewDidLeave(){
    // localStorage.removeItem('menus');
    localStorage.removeItem('cons_project');
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

            this.logoutAPi();
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
                  this.showAlert("Warning!", x.Pesan);
                  this.loading.dismiss();
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
            }
    );
  }

  goToFeed(link: any) {
    if(link == "ReportNUP") {
      this.goReportNUP();
    }
    else if(link == "ReportSales") {
      this.goReportSales();
    }
    // else if(link == "ReportAgentPage") {
    //   this.goReportAgent();
    // }
    else {
      this.nav.push(this.link[link], { user: localStorage.getItem("UserId") });
    }
  }

  // goReportAgent(){
  //   this.nav.push(ReportAgentPage, { user: localStorage.getItem("UserId") });
  // }

  goReportAgent(){

    var data = {
      cons : this.frontData.cons,
      entity : this.frontData.entity,
      projectNo : this.frontData.projectNo,
      projectName : this.frontData.projectName,
      projectPict : this.frontData.projectPict
    };

    this.nav.push(ReportAgentPage, { data:data });
  }

  goReportNUP(){
    const project = JSON.parse(localStorage.getItem("Project"));
    var token = base64Encode(project.cons+'-$-'+project.entity+'-$-'+project.projectNo+'-$-'+localStorage.getItem("Token"));

    const url = this.url_api+'dash_nup/index/'+token;

    const browser = this.iab.create(url,'_blank',{toolbar:'no',location:'no'});
    browser.on('loadstop').subscribe(event=>{
      if (event.url.match("mobile/close")) {
        browser.close();
    }
    });
    browser.show();
  }

  goReportSales(){
    const project = JSON.parse(localStorage.getItem("Project"));
    var token = base64Encode(project.cons+'-$-'+project.entity+'-$-'+project.projectNo+'-$-'+localStorage.getItem("Token"));

    const url = this.url_api+'dash_sales/index/'+token;
    // const options: InAppBrowserOptions ={
    //   zoom: 'yes'
    // }
    // const browser = this.iab.create(url,'_self',options);
    // browser.on('loadstop').subscribe(event=>{
    //   if (event.url.match("mobile/close")) {
    //     browser.close();
    // }
    // });
    // browser.show();
    window.open(url, '_system');
  }


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
