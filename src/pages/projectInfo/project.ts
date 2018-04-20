import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

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

@Component({
  selector: 'project-page',
  templateUrl: 'project.html'
})
export class ProjectPage {
  projects:any[] = [];
  loading:any;
  user:any;
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
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService
  ) {
    this.user = navParams.get('user');
    this.loading = this.loadingCtrl.create();
  } 
  logoutAPi(){
    let UserId = localStorage.getItem('UserId');

    this.http.get(this.url_api+"c_auth/Logout/" +UserId, {headers:this.hd} )
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              this.showAlert("Warning!", x.Pesan);
              this.loading.dismiss();
            }
            else {
              this.showAlert("Warning!", x.Pesan);
              this.loading.dismiss();
              // this.nav.pop();
            }
          }
          else {
            localStorage.clear();
            // alert('ok');
            this.nav.setRoot(WalkthroughPage);

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
                descs: val.project_descs,
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
            // this.nav.pop();
        }
      );
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
