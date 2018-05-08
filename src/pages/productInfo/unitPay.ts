import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, App, Platform, ViewController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ImageViewerController } from 'ionic-img-viewer';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { ContactPage } from './contact/contact';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';
import { Listing2Page } from '../listing2/listing2';

@Component({
  selector: 'unitPay-page',
  templateUrl: 'unitPay.html'
})
export class UnitPayPage {
  loading:any;
  url_api = environment.Url_API;
  cons:any;

  parm:any;
  ErrorList:any;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  plans:any[] = [];

  av:boolean = true;
  sell_price:any='-';
  picts:any[] = [];
  viewImg:ImageViewerController;
  device:string;

  frontData : any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public imgVw: ImageViewerController,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    private photoViewer:PhotoViewer,
    private file: File,
    private _app: App,
    private _authService: AuthService,
    public platform: Platform,
    private viewCtrl: ViewController
  ) {
    this.frontData = JSON.parse(localStorage.getItem('menus'));
    this.loading = this.loadingCtrl.create();
    this.device = localStorage.getItem('Device');
    this.parm =  this.navParams.get('data');
    this.cons = this.parm.cons;
    this.picts = this.parm.lot_type_pict;
    this.viewImg = imgVw;
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

  presentImage(floorImg) {
    // alert(floorImg);
    if(floorImg.search('assets/images') == -1){
      //image from API
      floorImg = floorImg.replace(/ /gi, '%20');
    }
    else {
      //image from LOCAL
      floorImg = this.file.applicationDirectory + 'www'+floorImg.substring(1,floorImg.length);
    }
    // alert(floorImg);
    // console.log(floorImg);
    // const imageViewer = this.viewImg.create(floorImg);
    // imageViewer.present();
    this.photoViewer.show(
      floorImg,
      this.parm.lot_no,
      {share:false}
    );
  }

  loadData() {
    this.http.get(this.url_api+"c_product_info/getPrice/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo  + "/" + this.parm.lot_no, {headers:this.hd} )
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
          var data = x.Data;
          this.sell_price = x.DataHC;
          data.forEach(val => {
            this.plans.push({
              plans: val.descs,
              amt: val.trx_amt
            });
          });
          // this.loading.dismiss();
          this.loadInfo();
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

  loadInfo() {
    this.http.get(this.url_api+"c_product_info/getInfo/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo  + "/" + this.parm.tower + "/" + this.parm.level + "/" + this.parm.lot_no, {headers:this.hd} )
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
          var data = x.Data[0];
          // console.log(data);
          this.parm.area = data.build_up_area;
          this.parm.uom = data.area_uom;
          this.parm.direct = data.direction_descs;
          // console.log(this.parm);
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

  contact(){
    // alert('a');
    // console.log(this.parm);
    var lot = "";
    if (this.parm.studios) {
      lot = this.parm.lot_type_desc;

    }else{
      lot = this.parm.lot_descs;
    }
    
    var desc="Saya tertarik reservasi\n"+this.parm.projectName+"\n"+this.parm.towerName+" | "+this.parm.levelDesc+"\n"+lot+" | "+this.parm.lot_no+"\n";

    this.nav.push(ContactPage,{data:this.parm, desc:desc});

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
