import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PaymentSchedulePage } from './payment';

@Component({
  selector: 'MyUnit-page',
  templateUrl: 'MyUnit.html'
})
export class MyUnitPage {
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
            this.showAlert("Error!", errS,'');
        }
      );
  }
  ionViewWillEnter(){
    // this.loading.present();
    // alert('tes');
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
              this.getUnit(el.db_profile).subscribe(
                (x:any) => {
                  if(x.Error == true) {
                    if(x.Status == 401){
                      // alert(x.Pesan);
                      // alert('b');
                      this.logoutAPi();
                      // this.showAlert("Warning!", x.Pesan);
                      this.loading.dismiss();
                      return true;
                    }
                    else {
                      //kalo ga ada data kesini
                      // console.log('hi:'+this.count);
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
               
                    }
                  }
                  else {
                    var datas = x.Data;

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
                        sell_price: es.sell_price,
                        debtor_acct : es.debtor_acct,
                        ProjectName : es.ProjectName,
                        AgentName : es.agent_name,
                        AgentPhone : es.agent_handphone,
                        Property : es.Property,
                        Level : es.Level,
                        Studio : es.Studio,
                        Bed : es.Bed,
                        Bath : es.Bath,
                        LotNo : es.LotNo,
                        Status : es.Status,
                        StatusText : es.StatusText,
                        LotTypeDesc : es.LotTypeDesc,
                        style : font_color
                      });

                      this.count = cnt;
                      this.available = true;
                      cnt += 1;
                     console.log(cnt);
                      if(now == end){
                        // alert(now +'/'+end);
                        this.loading.dismiss();
                      }
                    });
                    this.myRes = ress;
                 

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
                  // alert('a');
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
                    return;
                }
              );
              console.log(now);
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
 
            this.showAlert("Error!", errS);
        }
    );
  }

  ionViewDidLoad() {

  }

  getUnit(cons:any) {
    return this.http.get(this.url_api+"c_myunits/myUnit/" + cons + "/" + localStorage.getItem('UserId') + "/" + '', {headers:this.hd}  );
  }

  goPayment(data:any) {
    // console.log(data);
    console.log('edit');
    var datas = {
      entity : data.entity_cd,
      project : data.project_no,
      projectName : data.ProjectName,
      towerName : data.Property,
      level_descs : data.Level,
      sell_price : data.sell_price,
      lot : data.LotNo,
      debtor_acct : data.debtor_acct
    };
    // console.log(datas);
    this.nav.push(PaymentSchedulePage, { cons:data.db, id:data.rowID, datas:datas});
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
