import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, MinLengthValidator } from '@angular/forms';
import { NavController, NavParams, LoadingController, Platform, AlertController,App } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ImagePicker } from '@ionic-native/image-picker';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { ListingPage } from '../listing/listing';
import { UploadBuktiPage } from './uploadbukti';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { AuthService } from '../../auth/auth.service';
import { MyApp } from '../../app/app.component';

declare var cordova: any;

@Component({
  selector: 'payment-schedule-page',
  templateUrl: 'payment.html'
})
export class PaymentSchedulePage {
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  main_page: { component: any };
  months:any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  plans:any=[];
  available:boolean;
  loading:any;
  user:any;device:string;
  url_api = environment.Url_API;
  cons: any;

  selected_image:any;
  ErrorList:any;

  data:any;
  rowID:any;

  error:any;

  images:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public imagePicker: ImagePicker,
    private _errorService: ErrorhandlerService,
    private _app: App,
    private _authService: AuthService,
  ) {
    this.main_page = { component: TabsNavigationPage };
    this.loading = this.loadingCtrl.create();
    this.cons = this.navParams.get('cons');
    this.data = this.navParams.get('datas');
    this.device = localStorage.getItem('Device');
    
    console.log(this.data);
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });

    
  }
  logoutAPi(){
    this.loading.present();
    let UserId = localStorage.getItem('UserId');
    this._authService.logout().subscribe(
      (x:any) => {
        console.log(x);
              if(x.Error == true) {
                  this.showAlert("Warning!", x.Pesan,'');
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
                this.showAlert("Error!", errS,'');
            }
    );
   
    }
  ionViewDidLoad() {
    this.loading.present();
    this.loadData();
  }

  ionViewWillEnter(){
  
  }
  // addZero(i:any){
  //   if(i < 10){
  //     i = '0'+i;
  //   }

  //   return i;
  // }
  addZero(i){
    if(i < 10){
      i = '0'+i;
    }
  
    return i;
  }
  
 convertDate(date){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var d = new Date(date);
  
    return d.getDate().toString()+' '+months[d.getMonth()]+' '+d.getFullYear().toString();
  }
  loadData(){ 
    
    this.http.get(this.url_api+"c_myunits/getPrice/" + this.cons + "/" + this.data.entity.trim() + "/" + this.data.project.trim()  + "/" + this.data.debtor_acct, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
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
          // alert(JSON.stringify(data));
          this.available = true;
          data.forEach(val => {
            var font_color = '';

                      if(val.status_pembayaran == 'Y' ){
                      font_color = ' #007eca';
                      }else{
                        font_color = ' red';
                      }
            if(localStorage.getItem('Device')=='android'||localStorage.getItem('Device')=='web'){
              var d = new Date(val.due_date);
            }else{
              // var d = new Date(val.due_date.replace(' ','T'));
              var t = val.due_date.split(/[- :]/);
              var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
            }
            
            // alert(val.due_date);
            // alert(d);
            var fulldates = d.getDate().toString()+' '+this.months[d.getMonth().toString()]+' '+d.getFullYear().toString()+' '+this.addZero(d.getHours())+':'+this.addZero(d.getMinutes());
            var dates = this.convertDate(d);
            // console.log(dates);
            this.plans.push({
              due_date: dates,
              full_due_date:fulldates,
              status:val.status_pembayaran,
              status_descs:val.status_pemb_descs,
              plan: val.payment_descs,
              amt: val.trx_amt,
              rowID:val.rowID,
              style: font_color
            });
          });
          this.loading.dismiss();
          console.log(this.plans);
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
    
          this.showAlert("Error!", errS,'');
      }
    );
  }

  gotoTransfer(data:any){
    // console.log(data);
    this.nav.push(UploadBuktiPage, { cons:this.cons,datas:data,data1:this.data});
  }
  showAlert(title:any, subTitle:any, act:any) {
    var bah:any;
    if(act == 'back'){
      bah = {text : 'Ok', handler : () => {
        this.nav.pop();
      }};
    }
    else {
      bah = {text : 'Ok'};
    }
    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : title,
      subTitle : subTitle,
      buttons : [
        bah
      ]
    });

    warning.present();
  }



}
