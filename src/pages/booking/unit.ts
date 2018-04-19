import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController, ToastController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ImageViewerController } from 'ionic-img-viewer';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { BookingUnitModalPage } from './unitModal';

@Component({
  selector: 'bookingUnit-page',
  templateUrl: 'unit.html'
})
export class BookingUnitPage {
  units:any[] = [];
  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons:any;

  // colors:any[] = [];
  phase_desc: any;
  project_name:any;
  floor_desc:any;

  project_no:any;
  entity:any;
  propertyCd: any;
  level_no: any;
  pict:any;

  available: boolean = true;
  viewImg: ImageViewerController;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  ErrorList:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public alertCtrl: AlertController,
    public modal: ModalController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public imgVw: ImageViewerController,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
  ) {
    var data = JSON.parse(localStorage.getItem('data'));
    this.project_name = data.projectName;
    this.phase_desc= data.towerName;
    this.floor_desc=data.level_descs;
    this.project_no = data.project;
    this.entity = data.entity;
    this.propertyCd = data.towerCd;
    this.level_no = data.level;
    this.pict = data.level_pict;
    this.cons = data.cons;

    this.viewImg = imgVw;

    this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    this.loading.present();

    this.http.get(this.url_api+"c_booking/getUnit/" + this.cons + "/" + this.entity + "/" + this.project_no + "/" + this.propertyCd + "/" + this.level_no, {headers:this.hd} )
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
          // console.log(x);
          var data = x.Data;
          data.forEach(val => {
            var ss = false;
            var st = {'background-color' : '#2ec95c','border-radius': '10px'};

            if(val.room_qty == 0 && val.room_qty == 0){
              ss = true;
            }

            if(val.status != 'A'){
              st = {'background-color' : '#ff3333','border-radius': '10px'};
            }

            this.units.push({
              lot : val.lot_no,
              bed : val.room_qty,
              bath : val.bath_qty,
              status : val.status,
              type : val.lot_type,
              typeDesc : val.descs,
              studios : ss,
              style : st
              //ini hardcode ntr ganti ya
              // currency : 'IDR',
              // price : '1.21 Million',
              // area : 76,
              // uom : 'M2',
              // direct : 'Face North'
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

  goToReserve(unit:any) {
    // console.log(unit);

    if(unit.status == 'A') {
      var data = JSON.parse(localStorage.getItem("data"));
      data.lot_type = unit.type;
      data.lot_type_desc = unit.typeDesc;
      data.lot = unit.lot;
      data.bed = unit.bed;
      data.bath = unit.bath;
      data.studio = unit.studios;
      data.currency = unit.currency;
      data.price = unit.price;
      data.area = unit.area;
      data.uom = unit.uom;
      data.direct = unit.direct;
      // console.log(data);
      localStorage.setItem("data", JSON.stringify(data));

      // let modal = this.modal.create(UnitModalPage);
      // modal.onDidDismiss(data => {
      //   if(data.parm){
          this.nav.push(BookingUnitModalPage);
      //   }
      // });
      // modal.present();
    }
    else {
      let warning = this.alertCtrl.create({
        cssClass: 'showDetail',
        title : 'Unit Information<br><br>',
        subTitle : 'This Unit Not Available !',
        buttons : [
          {text : 'Ok'}
        ]
      });

      warning.present();
    }
  }

  presentImage(floorImg) {
    const imageViewer = this.viewImg.create(floorImg);
    imageViewer.present();
  }
}
