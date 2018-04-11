import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

import { ProductPhasePage } from './phase';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';

@Component({
  selector: 'productProject-page',
  templateUrl: 'project.html'
})
export class ProductProjectPage {
  projects:any[] = [];
  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
  available: boolean = true;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  ErrorList:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
  ) {
    this.user = localStorage.getItem("UserId");
    this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    this.loading.present();

    this.http.get(this.url_api+"c_product_info/getData/" + this.cons_mobile + "/" + this.user, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            this.showAlert("Warning!", x.Pesan);
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
          // console.log(data);
          data.forEach(val => {
            
            this.projects.push({
              entity: val.entity_cd,
              project: val.project_no,
              descs: val.project_descs,
              pic_path: val.picture_path ,
              url_path: val.http_add,
              db : val.db_profile
            });
          });
          this.loading.dismiss();
        }
      },
      (err)=>{
        // console.log(this.ErrorList);
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

  goToPhase(pro:any) {
    // console.log(pro);
    var data = {
      cons : pro.db,
      entity : pro.entity,
      projectNo : pro.project,
      projectName : pro.descs,
      projectPict : pro.pic_path
    };
    // console.log(data);
    this.nav.push(ProductPhasePage, {data:data});
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
