import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ImageViewerController } from 'ionic-img-viewer';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { ContactPage } from './contact/contact';
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

  picts:any[] = [];
  viewImg:ImageViewerController;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public imgVw: ImageViewerController,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
  ) {
    this.loading = this.loadingCtrl.create();
    this.parm =  this.navParams.get('data');
    this.cons = this.parm.cons;
    this.picts = this.parm.lot_type_pict;
    this.viewImg = imgVw;
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
    const imageViewer = this.viewImg.create(floorImg);
    imageViewer.present();
  }

  loadData() {
    this.http.get(this.url_api+"c_product_info/getPrice/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo  + "/" + this.parm.lot_no, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            this.showAlert("Warning!", x.Pesan);
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
            this.showAlert("Warning!", x.Pesan);
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
          console.log(this.parm);
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
    this.nav.push(ContactPage,{data:this.parm});
  }

}
