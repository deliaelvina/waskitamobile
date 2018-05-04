import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, App, Platform } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';
import { Listing2Page } from '../listing2/listing2';

@Component({
  selector: 'listingProject-page',
  templateUrl: 'project.html'
})
export class ListingProjectPage {
  projects:any[] = [];
  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
  available: boolean = true;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  ErrorList:any;
  device:string;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    private _app: App,
    private _authService: AuthService,
    public platform: Platform,
  ) {
    this.device = localStorage.getItem('Device');
    this.user = localStorage.getItem("UserId");
    this.loading = this.loadingCtrl.create();
  }

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

  ionViewDidLoad() {

    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    this.loading.present();

    this.http.get(this.url_api+"c_product_info/getData/" + this.cons_mobile + "/" + this.user, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan);
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            this.available = false;
            this.loading.dismiss();
          }
        }
        else {

          var data = x.Data;
          // console.log(data);
          data.forEach(val => {

            this.projects.push({
              entity: val.entity_cd,
              project: val.project_no,
              descs: val.project_descs,
              caption:val.caption_address,
              pic_path: val.picture_path ,
              url_path: val.http_add,
              db : val.db_profile
            });
          });
          this.loading.dismiss();
        }
      },
      (err)=>{
        // console.log(this.ErrorList);
        this.loading.dismiss();
        //filter error array
        this.ErrorList = this.ErrorList.filter(function(er){
            return er.Code == err.status;
        });

        var errS;
        //filter klo error'a tidak ada di array error
        if(this.ErrorList.length == 1 ){
          errS = this.ErrorList[0].Description;
        }else{
          errS = err;
        }
          // alert(errS);
          // let toast = this.toastCtrl.create({
          //   message: errS,
          //   duration: 3000,
          //   position: 'top'
          // });

          // toast.onDidDismiss(() => {
          //   console.log('Dismissed toast');
          // });
          // toast.present();
          this.showAlert("Error!", errS);
      }
    );
  }

  ionViewWillEnter(){
    localStorage.removeItem('menus');
  }

  // ionViewWillLeave(){
  //   localStorage.removeItem('menus');
  // }

  goToPhase(pro:any) {
    // console.log(pro);
    var data = {
      cons : pro.db,
      entity : pro.entity,
      projectNo : pro.project,
      projectName : pro.descs,
      projectPict : pro.pic_path,
      isFrom : 1
    };
    // console.log(data);
    localStorage.setItem('menus', JSON.stringify(data));
    this.nav.push(Listing2Page);
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
