import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, AlertController, ToastController, App, Platform } from 'ionic-angular';

// import { ProfilePage } from '../profile/profile';
// import { ProjectDetailsPage } from '../projectInfo/projectdetails';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { ErrorhandlerService } from '../../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../../walkthrough/walkthrough';
import { MyApp } from '../../../app/app.component';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 's_blok',
  templateUrl: 's_blok.html'
})
export class SearchBlok {
  loading:any;
  blok:any[] = [];
  items:any[] = [];

  parm:any;
  device:string;

  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
  user = localStorage.getItem('UserId');

  av:boolean = true;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  ErrorList:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public view :ViewController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    private _app: App,
    private _authService: AuthService,
    public platform: Platform,
  ) {
    this.device = localStorage.getItem('Device');

    this.loading = this.loadingCtrl.create();
    this.parm = this.navParams.get('data');
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
    this.loadItem();
    // this.items.push({
    //   type : '*',
    //   typeDesc : 'ALL'
    // });
    // this.blok = this.items;
    // this.loading.dismiss();
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

  loadItem(){
    // console.log(this.parm);
    this.http.get(this.url_api+"c_product_info/getLotType/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower, {headers:this.hd} )
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
            this.items = [];
            this.blok = this.items;
            this.loading.dismiss();
          }
        }
        else {
          this.items.push({
            type : '*',
            typeDesc : 'ALL'
          });

          var data = x.Data;
          // console.log(data);
          data.forEach(val => {
            this.items.push({
              type : val.lot_type,
              typeDesc : val.descs,
              typeSpec : val.spec_info
            });
          });

          this.blok = this.items;
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

  getItems(ev: any) {
    let val = ev.target.value;

    if(!val){
      this.blok = this.items;
    }
    else {
      this.blok = this.items.filter((item) => {
        return item.typeDesc.toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  GetBlok(ev:any):void{
    // console.log(ev);
    // this.loading.present();
    this.view.dismiss(ev);
  }

  dismiss() {
    this.view.dismiss();
  }
}
