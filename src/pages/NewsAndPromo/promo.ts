import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, App } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { NapDetails } from '../NewsAndPromo/napdetails';
import { PromoDetail } from '../NewsAndPromo/promodetail';
// import { ProjectDetailsPage } from '../projectInfo/projectdetails';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from 'ionic-angular';

// import { NapDetails } from './napdetails';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'promo-page',
  templateUrl: 'promo.html'
})
export class PromoPage {
  projects:any[] = [];
  loading:any;
  user:any;device:string;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  link_iframe:any ;
  ErrorList:any;
  available: boolean = true;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  constructor(
    public sanitizer:DomSanitizer,
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    private _app: App,
    private _authService: AuthService,
    public loadingCtrl: LoadingController,
    public socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
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
    this.loading.present();
    // localStorage.removeItem('cons_project');
    // console.log(this.cons);
      this.http.get(this.url_api+"c_newsandpromo/getDatapromo/" + this.cons, {headers:this.hd} )
      .subscribe(
        (x:any) => {
          console.log(x);
          if(x.Error == true) {
            if(x.Status == 401){
              // this.showAlert("Warning!", x.Pesan);
              this.logoutAPi();
              this.loading.dismiss();
              // this.nav.pop();
            }
            else {
              // this.available = false;
              // alert("No Data");
              this.showAlert("Warning!", "No Data");
              this.loading.dismiss();
              // this.nav.pop();
            }
          }
          else {
            x = x.Data;
            var data = x;
            var P = false
            var Y = false
            var date1 = ''
            data.forEach(val => {
              if(val.attach_type == 'P'){
                P = true
                Y = false
              }
              else{
                P = false
                Y = true
              }
              // console.log(val.descs)
              this.link_iframe = this.sanitizer.bypassSecurityTrustResourceUrl(val.youtube_link);
              date1 = val.date_created.substr(0, 10);
              this.projects.push({
                name:val.descs,
                con: val.content,
                pic_path: val.picture ,
                youtube:this.link_iframe,
                date:date1,
                subject:val.subject,
                id : val.id,
                p:P,
                y:Y
                // url_path: val.http_add,
                // entity_name: val.entity_name,
                // cons_project:val.db_profile
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

  goToProfile(event, item) {
    this.nav.push(ProfilePage, {
      user: item
    });
  }
  goToDetails(id:any) {
    // console.log("hehe");
    // console.log(project);
    localStorage.setItem('id',id);
    this.nav.push(PromoDetail);
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
