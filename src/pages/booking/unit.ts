import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ModalController, ToastController, Platform, App } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ImageViewerController } from 'ionic-img-viewer';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { BookingUnitModalPage } from './unitModal';
import { File } from '@ionic-native/file';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'bookingUnit-page',
  templateUrl: 'unit.html'
})
export class BookingUnitPage {
  units: any[] = [];
  loading: any;
  user: any;
  url_api = environment.Url_API;
  cons: any;

  // colors:any[] = [];
  phase_desc: any;
  project_name: any;
  floor_desc: any;

  project_no: any;
  entity: any;
  propertyCd: any;
  level_no: any;
  pict: any;
  bath: any;

  available: boolean = true;
  viewImg: ImageViewerController;

  hd = new HttpHeaders({
    Token: localStorage.getItem("Token")
  });
  ErrorList: any;
  device: string;

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
    private file: File,
    private photoViewer: PhotoViewer,
    private _app: App,
    private _authService: AuthService,
    public platform: Platform,
  ) {
    this.device = localStorage.getItem('Device');

    var data = JSON.parse(localStorage.getItem('data'));
    this.project_name = data.projectName;
    this.phase_desc = data.towerName;
    this.floor_desc = data.level_descs;
    this.project_no = data.project;
    this.entity = data.entity;
    this.propertyCd = data.towerCd;
    this.level_no = data.level;
    this.pict = data.level_pict;
    this.cons = data.cons;
    this.bath = data.bath;

    this.viewImg = imgVw;

    this.loading = this.loadingCtrl.create();
  }

  logoutAPi() {
    this.loading.present();
    let UserId = localStorage.getItem('UserId');
    this._authService.logout().subscribe(
      (x: any) => {
        // console.log(x);
        if (x.Error == true) {
          this.showAlert("Warning!", x.Pesan);
          this.loading.dismiss();
        }
        else {
          this.loading.dismiss();
          localStorage.clear();
          if (this.device == 'android') {
            navigator['app'].exitApp();
          } else {//ios and web
            this._app.getRootNav().setRoot(MyApp);
          }
        }
      },
      (err) => {
        this.loading.dismiss();
        //filter error array
        this.ErrorList = this.ErrorList.filter(function (er) {
          return er.Code == err.status;
        });

        var errS;
        if (this.ErrorList.length == 1) {
          errS = this.ErrorList[0].Description;
        } else {
          errS = err;
        }
        this.showAlert("Error!", errS);
      }
    );

  }

  ionViewDidLoad() {
    this._errorService.getData()
      .then(data => {
        this.ErrorList = data.Error_Status;
      });
    this.loading.present();

    this.http.get(this.url_api + "c_booking/getUnit/" + this.cons + "/" + this.entity + "/" + this.project_no + "/" + this.propertyCd + "/" + this.level_no, { headers: this.hd })
      .subscribe(
        (x: any) => {
          if (x.Error == true) {
            if (x.Status == 401) {
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
            var group = localStorage.getItem('Group')
            // console.log(x);
            var data = x.Data;
            data.forEach(val => {
              var ss = false;
              if (group.toUpperCase() == 'GUEST' || group.toUpperCase() == 'DEBTOR' || group.toUpperCase() == 'AGENT') {
                var st = { 'background-color': 'transparent', 'border-radius': '10px', 'color': 'black' };
              } else {
                var st = { 'background-color': '#2ec95c', 'border-radius': '10px', 'color': 'white' };
              }
              // var st = {'background-color' : '#2ec95c','border-radius': '10px'};

              if (val.room_qty == 0 && val.room_qty == 0) {
                ss = true;
              }

              // if(val.status != 'A'){
              //   st = {'background-color' : '#ff3333','border-radius': '10px'};
              // }
              if (group.toUpperCase() != 'GUEST' && group.toUpperCase() != 'DEBTOR' && group.toUpperCase() != 'AGENT') {

                if (val.status != 'A') {
                  st = { 'background-color': '#ff3333', 'border-radius': '10px', 'color': '#fff' };
                }
                if (val.status == 'R') {
                  st = { 'background-color': '#FFFF00', 'border-radius': '10px', 'color': '#fff' };
                }
              }

              this.units.push({
                lot: val.lot_no,
                bed: val.room_qty,
                bath: val.bath_qty,
                status: val.status,
                type: val.lot_type,
                typeDesc: val.descs,
                studios: ss,
                style: st,
                // amt1: val.trx_amt
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
        (err) => {
          this.loading.dismiss();
          //filter error array
          this.ErrorList = this.ErrorList.filter(function (er) {
            return er.Code == err.status;
          });

          var errS;
          //filter klo error'a tidak ada di array error
          if (this.ErrorList.length == 1) {
            errS = this.ErrorList[0].Description;
          } else {
            errS = err;
          }
          this.showAlert("Error!", errS);
        }
      );
  }

  showAlert(title: any, subTitle: any) {
    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title: title,
      subTitle: subTitle,
      buttons: [
        {
          text: 'Ok', handler: () => {
            this.nav.pop();
          }
        }
      ]
    });

    warning.present();
  }

  goToReserve(unit: any) {
    // console.log(unit);

    if (unit.status == 'A') {
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
      // data.trx_amt = unit.trx_amt;
      // console.log(data);
      localStorage.setItem("data", JSON.stringify(data));

      // let modal = this.modal.create(UnitModalPage);
      // modal.onDidDismiss(data => {
      //   if(data.parm){
      this.nav.push(BookingUnitModalPage);
      //   }
      // });
      // modal.present();
    } else if (unit.status == 'R') {
      let warning = this.alertCtrl.create({
        cssClass: 'showDetail',
        title: 'Unit Information<br><br>',
        subTitle: 'This Unit Already Reserved !',
        buttons: [
          { text: 'Ok' }
        ]
      });
      warning.present();
    }
    else {
      let warning = this.alertCtrl.create({
        cssClass: 'showDetail',
        title: 'Unit Information<br><br>',
        subTitle: 'This Unit Not Available !',
        buttons: [
          { text: 'Ok' }
        ]
      });
      warning.present();
    }

  }

  presentImage(floorImg) {
    // alert(floorImg);
    if (floorImg.search('assets/images') == -1) {
      //image from API
      floorImg = floorImg.replace(/ /gi, '%20');
    }
    else {
      //image from LOCAL
      floorImg = this.file.applicationDirectory + 'www' + floorImg.substring(1, floorImg.length);
    }
    // alert(floorImg);
    // console.log(floorImg);
    // const imageViewer = this.viewImg.create(floorImg);
    // imageViewer.present();
    this.photoViewer.show(
      floorImg,
      this.floor_desc,
      { share: false }
    );
  }
}
