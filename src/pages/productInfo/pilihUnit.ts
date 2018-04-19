import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { UnitPayPage } from './unitPay';
import { ImageViewerController } from 'ionic-img-viewer';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';

@Component({
  selector: 'pilihUnit-page',
  templateUrl: 'pilihUnit.html'
})
export class PilihUnitPage {
  loading:any;
  url_api = environment.Url_API;
  cons:any;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  parm:any;
  units:any[] = [];
  pict:any;
  ErrorList:any;

  av:boolean = true;

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
    private photoViewer:PhotoViewer,
    private file: File
  ) {
    this.loading = this.loadingCtrl.create();
    this.parm = this.navParams.get('data');
    this.cons = this.parm.cons;
    this.pict = this.parm.levelPict;
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

  goToUnitInfo(i:any){
    // console.log(i);
    if(i.status == 'A'){
      this.parm.lot_no = i.lot;
      this.parm.lot_descs = i.descs;
      this.parm.bed = i.bed;
      this.parm.bd = i.bd;
      this.parm.bath = i.bath;
      this.parm.bh = i.bh;
      this.parm.studios = i.studios;
      // console.log(this.parm);
      this.nav.push(UnitPayPage, {data:this.parm});
    }
    else {
      this.showAlert("Warning!", "This Unit Is Not Available");
      // console.log(i);
    }
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
    // alert(floorImg);
    if(floorImg.search('assets/images') == -1){
      //image from API
      floorImg = floorImg.replace(' ', '%20');
    }
    else {
      //image from LOCAL
      floorImg = this.file.applicationDirectory + 'www'+floorImg.substring(1,floorImg.length);
    }
    // alert(floorImg);
    // console.log(floorImg);
    // const imageViewer = this.viewImg.create(floorImg);
    // imageViewer.present();
    this.photoViewer.show(
      floorImg,
      this.parm.levelDesc,
      {share:false}
    );
  }

  loadData() {
    var item = [];
    var url = '';
    if(this.parm.lot_type == '*'){
      url = this.url_api+"c_product_info/getUnit/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower + "/" + this.parm.level;
    }
    else {
      url = this.url_api+"c_product_info/getUnit/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo + "/" + this.parm.tower + "/" + this.parm.level + "/" + this.parm.lot_type;
    }

    this.http.get(url, {headers:this.hd} )
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
          // console.log(x);
          var data = x.Data;
          // this.blocks = [];
          data.forEach(val => {
            let studio:boolean = false;
            var st = {'background-color' : '#2ec95c','border-radius': '10px'};
            var bd = val.room_qty+" Bedroom";
            var bh = val.bath_qty+" Bathroom";

            if(val.room_qty > 1) {
              bd += 's';
            }
            if(val.bath_qty > 1) {
              bh += 's';
            }

            if(val.room_qty == 0 && val.bath_qty == 0){
              studio = true;
            }

            if(val.status != 'A'){
              st = {'background-color' : '#ff3333','border-radius': '10px'};
            }

            item.push({
              lot: val.lot_no,
              descs: val.descs,
              bed : val.room_qty,
              bd : bd,
              bath : val.bath_qty,
              bh : bh,
              status : val.status,
              studios : studio,
              style : st
            });
          });

          this.units = item;
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

}
