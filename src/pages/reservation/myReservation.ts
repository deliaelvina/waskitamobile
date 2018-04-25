import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

import { ReservationPhasePage } from './phase';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ReservationReservePage } from './reserve';
import { WalkthroughPage } from '../walkthrough/walkthrough';

@Component({
  selector: 'MyreservationProject-page',
  templateUrl: 'myReservation.html'
})
export class MyReservationProjectPage {
  myRes:any[] = [];
  count:number = 0;
  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
  available: boolean = true;
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
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    private sanitizer: DomSanitizer,
  ) {
    this.user = navParams.get('user');
    this.loading = this.loadingCtrl.create();

    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });

    this.loading.present();
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

  ionViewWillEnter(){
    // this.loading.present();

    this.http.get(this.url_api+"c_reservate/getData/" + this.cons_mobile + "/" + this.user, {headers:this.hd}  )
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              // alert(x.Pesan);
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
            // this.myRes = [];
            var ress = [];
            var data = x.Data;
            var cnt = 1;
            // var av = [];
            var now = 0;
            var end = data.length;

            data.forEach(el => {
              now += 1;
              this.getReservation(el.db_profile).subscribe(
                (x:any) => {
                  if(x.Error == true) {
                    if(x.Status == 401){
                      // alert(x.Pesan);
                      // this.showAlert("Warning!", x.Pesan);
                      this.logoutAPi();
                      this.loading.dismiss();
                      return true;
                    }
                    else {
                      // alert(x.Pesan);
                      if(this.count == 0){
                        this.available = false;
                      }
                      else {
                        this.available = true;
                      }

                      if(now == end){
                        // alert(now +'/'+end);
                        this.loading.dismiss();
                      }
                      // this.available = false;
                      // av.push(false);
                      // this.loading.dismiss();
                    }
                  }
                  else {
                    var datas = x.Data;
                    // av.push(true);

                    // console.log(datas);
                    // var a = 1;
                    datas.forEach(es => {
                      var font_color = 'green';

                      if(es.Status == 'X' && es.Status == 'C'){
                      font_color = ' red';
                      }else if(es.Status == 'S'){
                        font_color = '#007eca'; //biru
                      }else{
                        font_color = ' green';
                      }
                      ress.push({
                        seq : cnt,
                        db : el.db_profile,
                        entity_cd : es.entity_cd,
                        project_no : es.project_no,
                        rowID : es.rowID,
                        ProjectName : es.ProjectName,
                        Name : es.Name,
                        Phone : es.Phone,
                        Property : es.Property,
                        Level : es.Level,
                        Studio : es.Studio,
                        Bed : es.Bed,
                        Bath : es.Bath,
                        LotNo : es.LotNo,
                        Status : es.Status,
                        StatusText : es.StatusText,
                        KTP : es.link_ktp,
                        NPWP : es.link_npwp,
                        TF : es.link_bukti_transfer,
                        LotTypeDesc : es.LotTypeDesc,
                        style : font_color
                      });

                      this.count = cnt;
                      this.available = true;
                      cnt += 1;
                      // a += 1;
                    // var ss = false;
                      if(now == end){
                        // alert(now +'/'+end);
                        this.loading.dismiss();
                      }
                    });
                    this.myRes = ress;
                    // this.loading.dismiss();
                    // return true;

                    // console.log(this.count);
                    // console.log(this.myRes);
                    // console.log(this.myRes.length);
                    // console.log(this.available);
                    // console.log(a);

                    if(this.count > 0){
                      this.available = true
                    }
                    else {
                      this.available = false
                    }
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

                    // return true;
                    this.showAlert("Error!", errS);
                    return;
                }
              );
            });

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
  }

  ionViewDidLoad() {

  }

  getReservation(cons:any) {
    return this.http.get(this.url_api+"c_reservate/myReservation/" + cons + "/" + localStorage.getItem('Name') + "/" + '', {headers:this.hd}  );
  }

  goReserve(data:any) {

    // alert('edit');
    var datas = {
      entity : data.entity_cd,
      project : data.project_no,
      projectName : data.ProjectName,
      towerName : data.Property,
      level_descs : data.Level,
      lot : data.LotNo,
    };

    if(data.Status == 'S'){
      // console.log(datas);
      this.nav.push(ReservationReservePage, {act:'edit', cons:data.db, id:data.rowID, datas:datas});
    }
    else {
      // alert('view');
      this.nav.push(ReservationReservePage, {act:'view', cons:data.db, id:data.rowID, datas:datas});
    }

  }

  // goReserveView(data:any) {
  //   alert('view');
  // }

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
