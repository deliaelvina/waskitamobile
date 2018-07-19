import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, Platform,App } from 'ionic-angular';

import { ProfilePage } from '../profile/profile';
import { ProjectDetailsPage } from '../projectInfo/projectdetails';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { ToastController } from 'ionic-angular';
//error handle
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'project-page',
  templateUrl: 'project.html'
})
export class ProjectPage {
  projects:any[] = [];
  loading:any;
  user:any; device:string;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
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
    public socialSharing: SocialSharing,
    private _app: App,
    private _authService: AuthService,
    public platform: Platform,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService
  ) {
    // this.user = navParams.get('user');
    this.user = localStorage.getItem('User');
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
    localStorage.removeItem('cons_project');
    // console.log(this.cons);
      this.http.get(this.url_api+"c_reservation/getData/" + this.cons_mobile + "/" + this.user, {headers:this.hd} )
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              // this.showAlert("Warning!", x.Pesan);
              this.logoutAPi();
              this.loading.dismiss();
            }
            else {
              this.showAlert("Warning!", x.Pesan);
              this.loading.dismiss();
              // this.nav.pop(); 
            }
          }
          else {
            x = x.Data;
            // console.log(x);
            var data = x;
            data.forEach(val => {
              // console.log(val.project_descs);
              this.projects.push({
                entity: val.entity_cd,
                project: val.project_no,
                handphone:val.handphone,
                descs: val.project_descs,
                caption:val.caption_address,
                pic_path: val.picture_path ,
                url_path: val.http_add,
                cons_project:val.db_profile
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
          
            this.showAlert("Error!", errS);
            // this.nav.pop();
        }
      );
      console.log(this.projects);
  }

  goToProfile(event, item) {
    this.nav.push(ProfilePage, {
      user: item
    });
  }
  goToDetails(project:any) {
    // console.log("hehe");
    // console.log(project);
    localStorage.setItem('cons_project',project.cons_project);
    this.nav.push(ProjectDetailsPage, { project : project });
    // this.nav.push(ProjectPage, { user : localStorage.getItem('UserId')});
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
