import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController, App, Platform, ViewController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { PilihUnitPage } from './pilihUnit';
import { SearchBlok } from './search-page/s_blok';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';
import { Listing2Page } from '../listing2/listing2';
import { UnitEnquiryPage } from '../unit-enquiry/unit-enquiry';
@Component({
  selector: 'formSearch-page',
  templateUrl: 'formSearch.html'
})
export class FormSearchPage {
  loading:any;
  loading2:any;
  url_api = environment.Url_API;
  cons:any;

  parm: any;

  data: any;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  av:boolean = true;

  blocks:any[] = [];
  ErrorList:any;
  device:string;
  frontData : any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public modal: ModalController,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    private _app: App,
    private _authService: AuthService,
    public platform: Platform,
    private viewCtrl: ViewController
  ) {
    this.frontData = JSON.parse(localStorage.getItem('menus'));
    this.device = localStorage.getItem('Device');
    this.loading = this.loadingCtrl.create();
    this.parm = this.navParams.get('data');
    console.log(this.parm);
    this.cons = this.parm.cons;
    // console.log(this.parm);
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
    this.loadData2(this.parm.lot_type);
    // this.loadData();
  }

  loadData() {
    var item = [];
    var url = this.url_api+"c_product_info/getBlok/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower;

    this.http.get(url, {headers:this.hd} )
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
            this.av = false;
            this.loading.dismiss();
          }
        }
        else {
          this.av = true;
          // console.log(x);
          var data = x.Data;
          // this.blocks = [];
          data.forEach(val => {
            item.push({
              level_no: val.level_no,
              descs: val.descs,
              pict: val.picture_url
            });
          });

          this.blocks = item;
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

  loadData2(type:any) {
    // alert("Hai");
    var item = [];
    var url = this.url_api+"c_product_info/getBlok/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower + "/" + type;

    this.http.get(url, {headers:this.hd} )
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
            this.av = false;
            this.loading.dismiss();
          }
        }
        else {
          this.av = true;
          // console.log(x);
          var data = x.Data;
          // this.blocks = [];
          data.forEach(val => {
            item.push({
              level_no: val.level_no,
              descs: val.descs,
              pict: val.picture_url
            });
          });

          this.blocks = item;
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

  showSearchType() {
    // alert('test');
    let modal = this.modal.create(SearchBlok, {data:this.parm});
    modal.onDidDismiss(data=>{
      this.loading = this.loadingCtrl.create();
      // console.log(data.type + " : " + this.parm.lot_type);
      if(data){
        if(data.type != this.parm.lot_type){
          this.loading.present();
          if(data.type == '*'){
            this.loadData();
          }
          else {
            this.loadData2(data.type);
          }
        }
        this.parm.lot_type = data.type;
        this.parm.lot_type_desc = data.typeDesc;
        this.parm.lot_spec = data.typeSpec
        // console.log(this.parm);
        // loading.dismiss();
      }
    });
    modal.present();
  }

  selectBlock(i:any){
    this.parm.level = i.level_no;
    this.parm.levelDesc = i.descs;
    this.parm.levelPict = i.pict;
    // console.log(this.parm);
    this.nav.push(PilihUnitPage, {data : this.parm});
  }
  gotoUnitEnquiry(){
    // this.parm.blocks = this.blocks;
    this.nav.push(UnitEnquiryPage,{data:this.parm});
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
