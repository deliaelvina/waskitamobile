import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController, App, Platform } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';
import { Unit } from './unit';
import { UnitPayPage } from '../productInfo/unitPay';

@Component({
  selector: 'unit-enquiry-page',
  templateUrl: 'unit-enquiry.html'
})
export class UnitEnquiryPage {
  loading:any;
  loading2:any;
  url_api = environment.Url_API;
  cons:any;
  pict:any=[];
  parm: any;

  data: any;
  clspn:any;
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  av:boolean = true;

  blocks:any[] = [];
  ErrorList:any;
  device:string;
  // units:any[] = [];
  units:Unit[];
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
  ) {
    this.device = localStorage.getItem('Device');
    this.loading = this.loadingCtrl.create();
    this.parm = this.navParams.get('data');
    this.cons = this.parm.cons;
    this.GetDataUnit();
    this.GetDataLevel();


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
    // this.GetDataLevel();
    // this.GetDataUnit();
    // this.loadData();
  }

  GetDataUnit() {
    var item = [];
    var  url = this.url_api+"c_product_info/getAllUnit/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower;


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
          // console.log(x);
          var group = localStorage.getItem('Group')
          // var st = '';

          // console.log(st);
          var data = x.Data;
          // console.log(x);
          // this.blocks = [];
          data.forEach(val => {
            let studio:boolean = false;
            if(group.toUpperCase()=='GUEST'||group.toUpperCase()=='DEBTOR'){
              var st = {'background-color' : 'transparent','border-radius': '10px','color':'black'};
            }else{
              var st = {'background-color' : '#2ec95c','border-radius': '10px','color':'white'};
            }
            var bd = val.room_qty+" Bedroom";
            var bh = val.bath_qty+" Bathroom";

            if(val.room_qty > 1) {
              bd += 's';
            }
            if(val.bath_qty > 1) {
              bh += 's';
            }

            if(val.room_qty == 0 && val.bath_qty == 0){
              studio = true;
            }

            if(group.toUpperCase()!='GUEST' && group.toUpperCase()!='DEBTOR'){

              if(val.status != 'A'){
                st = {'background-color' : '#ff3333','border-radius': '10px','color':'#fff'};
              }
            }
            

            item.push({
              lot: val.lot_no,
              descs: val.descs,
              bed : val.room_qty,
              bd : bd,
              bath : val.bath_qty,
              bh : bh,
              status : val.status,
              studios : studio,
              url : val.gallery_url,
              title : val.gallery_title,
              style : st,
              level_no:val.level_no
            });
          });

          this.units = item;
          // console.log(this.units);
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
          this.showAlert("Error!", errS);
      }
    );
  }

  GetDataLevel() {
    // alert("Hai");
    var item = [];
    var url = this.url_api+"c_product_info/getLevelEnquiry/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower ;

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
            this.clspn = val.LengthColumn;
          });

          this.blocks = item;
          console.log('getLevel');
          console.log(this.clspn);
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

  GetLengtColumn(){
    //a
  }

  showAlert(title:any, subTitle:any) {
    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : title,
      subTitle : subTitle,
      buttons : [
        {text : 'Ok', handler: () => {
          // this.nav.pop();
        }}
      ]
    });

    warning.present();
  }

  goToUnitInfo(i:any,level:any){
    // alert('asdf');
    // console.log(i);
    // console.log(level);

    if(i.status == 'A'){
      this.pict.push({
        url : i.url,
        title : i.title
      });
      this.parm.lot_no = i.lot;
      this.parm.lot_descs = i.descs;
      this.parm.bed = i.bed;
      this.parm.bd = i.bd;
      this.parm.bath = i.bath;
      this.parm.bh = i.bh;
      this.parm.studios = i.studios;
      this.parm.levelDesc = level;
      this.parm.lot_type_pict = this.pict;
      // console.log(this.parm);
      this.nav.push(UnitPayPage, {data:this.parm});
    }
    else {
      this.showAlert("Warning!", "This Unit Is Not Available");
      // console.log(i);
    }
  }


}
