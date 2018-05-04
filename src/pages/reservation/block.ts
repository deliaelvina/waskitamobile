import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, App } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ReservationUnitPage } from './unit';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'block-page',
  templateUrl: 'block.html'
})
export class ReservationBlockPage {
  blocks:any[] = [];

  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons:any;device:string;

  project_name: any;
  phase_desc:any;

  project_no:any;
  entity:any;
  propertyCd: any;
  available: boolean = true;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  ErrorList:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    private _app: App,
    private _authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
  ) {
    var data= JSON.parse(localStorage.getItem('data'));
    this.project_name = data.projectName;
    this.phase_desc= data.towerName;
    this.project_no = data.project;
    this.entity = data.entity;
    this.propertyCd = data.towerCd;
    this.cons = data.cons;
    this.device = localStorage.getItem('Device');
    this.loading = this.loadingCtrl.create();
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
    // alert("hee");
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });

    this.loading.present();

    this.http.get(this.url_api+"c_reservate/getBlock/" + this.cons + "/" + this.entity + "/" + this.project_no + "/" + this.propertyCd, {headers:this.hd} )
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
          // console.log(x);
          var data = x.Data;
          data.forEach(val => {

            this.blocks.push({
              level_no: val.level_no,
              descs: val.descs,
              pict: val.picture_url
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

  goToUnit(blc:any) {
    // console.log(blc);

    // if(blc.level_no == '01') { //nanti dimatiin ya
      var data = JSON.parse(localStorage.getItem("data"));
      data.level = blc.level_no;
      data.level_descs = blc.descs;
      data.level_pict = blc.pict;
      // console.log(data);
      localStorage.setItem("data", JSON.stringify(data));
      this.nav.push(ReservationUnitPage);
    // }
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
