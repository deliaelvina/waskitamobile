import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { BookingBlockPage } from './block';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';

@Component({
  selector: 'bookingPhase-page',
  templateUrl: 'phase.html'
})
export class BookingPhasePage {
  phase:any[] = [];

  loading:any;
  url_api = environment.Url_API;
  cons:any;

  project_no:any;
  entity:any;
  project_name: any;

  available: boolean = true;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  data:any;
  agent_cd:any;
  group:any;

  ErrorList:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
  ) {
    var data= JSON.parse(localStorage.getItem('data'));
    this.data = data;
    this.project_no = data.project;
    this.entity = data.entity;
    this.project_name = data.projectName;
    this.cons = data.cons;
    // var phasedeskripsi = JSON.parse(localStorage.getItem('data'));
    // console.log(projeknama);

    this.group = localStorage.getItem('Group');
    console.log(this.group);
    if(this.group == 'Guest'){
      this.data.agentGroupCd = '';
      this.data.agentTypeCd = '';
    }
    else {
      this.agent_cd = localStorage.getItem('AgentCd');
      this.getAgent();
    }

    this.loading = this.loadingCtrl.create();

    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
  }


  ionViewDidLoad() {
    this.loading.present();
    // console.log(this.project_no, this.entity);
    // alert("hee");
    this.http.get(this.url_api+"c_booking/getTower/" + this.cons + "/" + this.entity + "/" + this.project_no, {headers:this.hd} )
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
            // this.available = true;
            var data = x.Data;
            data.forEach(val => {

              this.phase.push({
                row: val.rowID,
                property_cd: val.property_cd,
                descs: val.descs,
                url:val.picture_url
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
            let toast = this.toastCtrl.create({
              message: errS,
              duration: 3000,
              position: 'top'
            });

            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
            toast.present();
        }
      );
    // this.loading.dismiss();
  }

  getAgent(){
    this.http.get(this.url_api+"c_booking/getAgent/" + this.cons + "/" + this.agent_cd , {headers:this.hd} )
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
              this.data.agentGroupCd = '';
              this.data.agentTypeCd = '';
              this.loading.dismiss();
            }
          }
          else {
            // console.log(x);
            var data = x.Data[0];
            this.data.agentGroupCd = data.group_cd;
            this.data.agentTypeCd = data.agent_type_cd;
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

  goToBlock(phase:any){
    // console.log(phase);
    // var data = JSON.parse(localStorage.getItem("data"));
    this.data.towerCd = phase.property_cd;
    this.data.towerName = phase.descs;
    // console.log(data);
    localStorage.setItem("data", JSON.stringify(this.data));
    this.nav.push(BookingBlockPage);
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