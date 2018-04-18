import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ViewController, ToastController, AlertController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { ImageViewerController } from 'ionic-img-viewer';
import { ListingPage } from '../listing/listing';
import { BookingPaymentDetailPage } from './paymentDtl';

@Component({
  selector: 'unitModal-page',
  templateUrl: 'unitModal.html'
})
export class BookingUnitModalPage {

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
  }

  ionViewDidLoad() {
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });

    this.loading.present();
    this.loadPrice();
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

  cekUnitStatus(plan:any){
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
            // this.viewCtrl.dismiss({parm:'parm'});
            // this.nav.push(ReservationReservePage, {act:'no'});

            this.data.payment_cd = plan.payment_cd;
            this.data.payment_descs = plan.plans;
            this.data.payment_amt = plan.amt;
            this.data.payment_amt2 = plan.amt2;

            this.data.gallery = this.gallery;

            this.data.bath = this.details.bath;
            this.data.bed = this.details.bed;
            this.data.direct = this.details.direct;
            this.data.area = this.details.area;
            this.data.uom = this.details.uom;

            localStorage.setItem('data', JSON.stringify(this.data));
            this.nav.push(BookingPaymentDetailPage);


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
    this.http.get(this.url_api+"c_booking/getInfo/" + this.cons + "/" + this.data.entity + "/" + this.data.project + "/" + this.data.towerCd + "/" + this.data.level + "/" + this.data.lot, {headers:this.hd} )
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
            // this.viewCtrl.dismiss();
            // alert(1);
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);

          var datas = x.Data[0];

          var bd = this.data.bed+' Bedroom';
          var bt = this.data.bath+' Bathroom';

          if(this.data.bed > 1){
            bd += 's';
          }
          if(this.data.bath > 1){
            bt += 's';
          }

          this.details = {
            'type' : this.data.lot_type,
            'typeDesc' : this.data.lot_type_desc,
            'project' : this.data.projectName,
            'tower' : this.data.towerName,
            'level' : this.data.level_descs,
            'lot' : this.data.lot,
            'bed' : bd,
            'bath' : bt,
            'studios' : this.data.studio,
            'area' : datas.build_up_area,
            'uom' : datas.area_uom,
            'direct' : datas.direction_descs,
          };

          //Load Gallery
          this.http.get(this.url_api+"c_booking/getGallery/" + this.cons + "/" + this.data.entity + "/" + this.data.project + "/" + this.data.lot_type , {headers:this.hd} )
          .subscribe(
            (z:any) => {
              if(z.Error == true) {
                  if(z.Status == 401){
                    this.showAlert("Warning!", z.Pesan);
                    this.loading.dismiss();
                  }
                  else {
                    // alert(x.Pesan);
                    // this.available = false;
                    // this.viewCtrl.dismiss();
                    // alert(2);
                    this.loading.dismiss();
                  }
                }
                else {
                  var dataZ = z.Data;
                  dataZ.forEach(val => {
                    this.gallery = [];
                    this.gallery.push({
                      url : val.gallery_url,
                      title : val.gallery_title
                    });
                  });

                  console.log(this.gallery);
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
                return true;
            }
          );
          // console.log(this.details);
          // this.loading.dismiss();
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

  loadPrice(){
    this.http.get(this.url_api+"c_booking/getPrice/" + this.cons + "/" + this.data.entity + "/" + this.data.project  + "/" + this.data.lot, {headers:this.hd} )
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
              payment_cd:val.payment_cd,
              plans: val.descs,
              amt: val.trx_amt,
              amt2: val.trx_amt2
            });
          });
          // this.loading.dismiss();
          this.loadData();
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

  goToDetails(plan:any){
    // console.log(this.data);
    // console.log(plan);
    // console.log(this.gallery);
    // console.log(this.details);

    this.cekUnitStatus(plan);

  }

}