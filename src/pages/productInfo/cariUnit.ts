import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { FormSearchPage } from './formSearch';
import { ImageViewerController } from 'ionic-img-viewer';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'cariUnit-page',
  templateUrl: 'cariUnit.html'
})
export class CariUnitPage {
  loading:any;
  url_api = environment.Url_API;
  cons:any;

  parm:any;types:any;
  pict:any[] = [{
    url : 'http://localhost:2121/waskitaAPI/images/noimage.png',
    title : 'No Images'
  }];

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  viewImg:ImageViewerController;
  ErrorList:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public imgVw:ImageViewerController,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    private photoViewer:PhotoViewer,
    private file: File
  ) {
    this.loading = this.loadingCtrl.create();
    this.parm = this.navParams.get('data');
    this.types = this.navParams.get('type');
    this.cons = this.parm.cons;
    this.viewImg = imgVw;
    console.log(this.types);
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
    // alert("hee");
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    this.loading.present();
    this.loadGallery();
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
      this.types.remarks,
      {share:false}
    );
  }

  cariUnit() {
    this.parm.lot_type_pict = this.pict;
    // console.log(this.parm);
    this.nav.push(FormSearchPage, {data:this.parm});
  }

  loadGallery() {
    this.http.get(this.url_api+"c_product_info/getGallery/" + this.cons + "/" + this.parm.entity + "/" + this.parm.projectNo  + "/" + this.parm.lot_type, {headers:this.hd} )
    .subscribe((x:any) => {
      if(x.Error == true) {
        if(x.Status == 401){
          // this.showAlert("Warning!", x.Pesan);
          this.logoutAPi();
          this.loading.dismiss();
        }
        else {
          // alert(x.Pesan);
          this.loading.dismiss();
        }
      }
      else {
        var data = x.Data;
        this.pict = [];
        data.forEach(val => {
          this.pict.push({
            url : val.gallery_url,
            title : val.gallery_title
          });
        });
        // console.log(this.pict);
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
