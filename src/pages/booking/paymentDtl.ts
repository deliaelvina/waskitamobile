import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, ToastController, AlertController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { ImageViewerController } from 'ionic-img-viewer';
import { ListingPage } from '../listing/listing';
import { BookingReservePage } from './reserve';

@Component({
  selector: 'paymentDtl-page',
  templateUrl: 'paymentDtl.html'
})
export class BookingPaymentDetailPage {

  loading:any;
  user:any;

  url_api = environment.Url_API;
  // url_api = "http://localhost:2121/WaskitaAPI/";
  cons:any;

  details:any;
  link_iframe:any ;
  ErrorList:any;

  gallery:any[] = [{
    url : 'http://35.197.137.111/waskitaAPI/images/noimage.png',
    title : 'No Images'
  }];

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  data = JSON.parse(localStorage.getItem("data"));
  viewImg:any;

  av:boolean = true;
  plans:any[] = [];

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public viewCtrl: ViewController,
    private sanitizer: DomSanitizer,
    public alertCtrl: AlertController,
    // public iab: InAppBrowser,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    public imgVw: ImageViewerController,
  ) {
    this.cons = this.data.cons;
    this.viewImg = imgVw;
    this.loading = this.loadingCtrl.create();
    this.gallery = this.data.gallery;

    this.details = {
      project:this.data.projectName,
      tower:this.data.towerName,
      level:this.data.level_descs,
      lot:this.data.lot,
      area:this.data.area,
      uom:this.data.uom,
      typeDesc:this.data.lot_type_desc,
      studios:this.data.studio,
      bed:this.data.bed,
      bath:this.data.bath,
      direct:this.data.direct,
      payment:this.data.payment_descs,
      payment_amt:this.data.payment_amt
    };
  }

  ionViewDidLoad() {
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });

    this.loading.present();
    this.loadData();
    console.log(this.details);
  }

  presentImage(floorImg) {
    const imageViewer = this.viewImg.create(floorImg);
    imageViewer.present();
  }

  loadFrame() {
    this.loading.present();
    var data = JSON.parse(localStorage.getItem("data"));
    this.link_iframe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url_api+"c_iFrame/getReservation/"+this.cons+"/"+data.entity+"/"+data.project+"/"+data.towerCd+"/"+data.level+"/"+data.lot);

    this.loading.dismiss();
  }

  cekUnitStatus(){
    this.http.get(this.url_api+"c_booking/cekUnit/" + this.cons + "/" + this.data.entity + "/" + this.data.project + "/" + this.data.towerCd + "/" + this.data.level + "/" + this.data.lot, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            this.showAlert("Warning!", x.Pesan);
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            // this.available = false;
            this.showAlert("Warning!", "No Info Available");
            this.viewCtrl.dismiss();
            // alert(1);
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);

          var datas = x.Data[0];

          // console.log(datas);
          if(datas.status == 'A'){
            this.viewCtrl.dismiss({parm:'parm'});
            // this.nav.push(ReservationReservePage, {act:'no'});
          }
          else {
            this.showAlert("Warning!", "This Lot is Already Reserved");
            this.nav.setRoot(ListingPage);
          }
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

  loadData() {
    //Load Data
    this.http.get(this.url_api+"c_booking/getPayDetail/" + this.cons + "/" + this.data.entity + "/" + this.data.project + "/" + this.data.lot + "/" + this.data.payment_cd, {headers:this.hd} )
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
            // this.showAlert("Warning!", "No Info Available");
            // this.viewCtrl.dismiss();
            // alert(1);
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);

          var datas = x.Data;

          console.log(datas);
          datas.forEach(val => {
            this.plans.push({
              descs: val.descs,
              amt: val.trx_amt
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

    // console.log(this.details);

  }

  showAlert(title:any, subTitle:any) {
    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : title,
      subTitle : subTitle,
      buttons : [
        {text : 'Ok'}
      ]
    });

    warning.present();
  }

  onBooking(plan:any){
    this.nav.push(BookingReservePage,{act:'book'});
  }

}