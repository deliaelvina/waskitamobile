import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { UnitTypePage } from './unitType';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'productPhase-page',
  templateUrl: 'phase.html'
})
export class ProductPhasePage {
  phase:any[] = [];

  loading:any;
  url_api = environment.Url_API;
  cons:any;
  project_name: any;

  available: boolean = true;
  ErrorList:any;

  parm:any;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  data = {
    entity : '',
    projectNo : '',
    projectName : '',
    projectPict : '',
    tower : '',
    towerName : ''
  };

  // pict:any[] = [
  //   "./assets/images/reservation/phase1.png",
  //   "./assets/images/reservation/phase2.png",
  //   "./assets/images/reservation/2.png",
  //   "./assets/images/reservation/1.png",
  //   "./assets/images/reservation/4.png",
  //   "./assets/images/reservation/3.png",
  // ];

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
  ) {
    this.loading = this.loadingCtrl.create();

    this.parm = this.navParams.get('data');
    this.project_name = this.parm.projectName;
    this.cons = this.parm.cons;
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
    // console.log(this.project_no, this.entity);
    // alert("hee");
    this.http.get(this.url_api+"c_product_info/getTower/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo, {headers:this.hd} )
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

              this.phase.push({
                row: val.rowID,
                property_cd: val.property_cd,
                descs: val.descs,
                pict : val.picture_url
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
    // this.loading.dismiss();
  }

  goToBlock(phase:any){
    this.parm.tower = phase.property_cd;
    this.parm.towerName = phase.descs;

    this.nav.push(UnitTypePage, {data:this.parm});
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
