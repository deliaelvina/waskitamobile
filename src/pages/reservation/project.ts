import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, App } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

import { ReservationPhasePage } from './phase';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'reservationProject-page',
  templateUrl: 'project.html'
})
export class ReservationProjectPage {
  projects:any[] = [];
  loading:any;
  user:any;device:string;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
  available: boolean = true;
  ErrorList:any;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private _app: App,
    private _authService: AuthService,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
  ) {
    this.user = navParams.get('user');
    this.loading = this.loadingCtrl.create();
    this.device = localStorage.getItem('Device');
  }

  logoutAPi(){
    this.loading.present();
    let UserId = localStorage.getItem('UserId');
    this._authService.logout().subscribe(
      (x:any) => {
        console.log(x);
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

      this.http.get(this.url_api+"c_reservate/getData/" + this.cons_mobile + "/" + this.user, {headers:this.hd}  )
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              // alert(x.Pesan);
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
            data.forEach(val => {
              this.projects.push({
                entity: val.entity_cd,
                project: val.project_no,
                descs: val.descs,
                caption:val.caption_address,
                pic_path:val.picture_path ,
                url_path: val.http_add,
                cons_project:val.db_profile,
                header_pict : val.picture_url,
              });
            });
            this.loading.dismiss();
          }
        },
        (err)=>{
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
    localStorage.removeItem('data');
  }

  goToPhase(pro:any) {
    // console.log(pro);
    var data = {
      cons : pro.cons_project,
      project : pro.project,
      entity : pro.entity,
      projectName : pro.descs,
      header_pict : pro.header_pict,
      towerCd : '',
      towerName : '',
      level : '',
      level_descs : '',
      lot : '',
      bed : 0,
      bath : 0,
      studio : '',
      currency : '',
      price : '',
      area : 0,
      uom : '',
      direct : ''
    };
    // console.log(data);
    localStorage.removeItem("data");
    localStorage.setItem("data", JSON.stringify(data));
    this.nav.push(ReservationPhasePage);
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
