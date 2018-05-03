import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, App, Platform, ViewController} from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { CariUnitPage } from './cariUnit';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';
import { ListingPage } from '../listing/listing';
import { Listing2Page } from '../listing2/listing2';

@Component({
  selector: 'unitType-page',
  templateUrl: 'unitType.html'
})
export class UnitTypePage {
  loading:any;
  url_api = environment.Url_API;
  cons:any;

  types:any[]=[];

  parm: any;
  av: boolean = true;
  ErrorList:any;
  device:string;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  frontData : any;

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
    private viewCtrl: ViewController
  ) {
    this.frontData = JSON.parse(localStorage.getItem('menus'));
    this.loading = this.loadingCtrl.create();
    this.device = localStorage.getItem('Device');
    this.parm = this.navParams.get('data');
    this.cons = this.parm.cons;
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
    // alert("hee");
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    this.loading.present();
    this.loadData();
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

  loadData() {
    this.http.get(this.url_api+"c_product_info/getLotType/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower, {headers:this.hd})
    .subscribe((x:any) => {
      if(x.Error == true) {
        if(x.Status == 401){
          // this.showAlert("Warning!", x.Pesan);
          this.logoutAPi();
          this.loading.dismiss();
        }
        else {
          // alert(x.Pesan);
          this.av = false;
          this.types = [];
          this.loading.dismiss();
        }
      }
      else {
        var data = x.Data;

        data.forEach(val => {
          this.types.push({
            lot_type : val.lot_type,
            descs : val.descs,
            remarks : val.remarks?val.remarks:'No Remarks',
            pict : val.picture_url,
            spec : val.spec_info,
            bath: val.qty_bath,
            room: val.qty_room
          });
        });

        // console.log(this.types);
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

  goToFindUnit(i:any){
    // console.log(i);
    this.parm.lot_type = i.lot_type;
    this.parm.lot_type_desc = i.descs;
    this.parm.lot_spec = i.spec;
    // console.log(this.parm);
    this.nav.push(CariUnitPage, {data:this.parm, type:i});
  }

  home(){
    if(this.frontData){
      // alert('ada');
      this.nav
      .push(Listing2Page, {}, { animate: true, direction: 'back' })
      .then(() => {

          const index = this.viewCtrl.index;

          for(let i = index; i > 1; i--){
              this.nav.remove(i);
          }

      });
    }
    else {
      // alert('gaada');
      this.nav.popToRoot();
    }
  }

}
