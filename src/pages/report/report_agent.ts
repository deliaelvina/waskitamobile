import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, MinLengthValidator } from '@angular/forms';
import { NavController, NavParams, LoadingController, AlertController, ToastController, App, ViewController} from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';

// import { ReservationPhasePage } from './phase';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { DomSanitizer } from '@angular/platform-browser';
// import { ReservationReservePage } from './reserve';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'ReportAgentProject-page',
  templateUrl: 'report_agent.html'
})
export class ReportAgentPage {
  myRep:any[] = [];
  count:number = 0;
  loading:any;
  user:any;device:any;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
  // available: boolean = true;
  ErrorList:any;


  data:any;
  // view:boolean = false;
  view2:boolean = false;
  act:any;
  propertys:any;
  salez:any;
  propss:any[] = [];
  saless:any[] = [];
  edit: boolean = false;

  project_name: any;
  project_no: any;
  entitys:any;
  reportss: any[] = [];
  parm:any;
  rpt:any[] = [];
  av:boolean = true;

  reportForm: FormGroup;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    public view :ViewController,
    private _app: App,
    private _authService: AuthService,
    private _errorService: ErrorhandlerService,
    private sanitizer: DomSanitizer,
  ) {
    this.user = localStorage.getItem('User');
    // this.user = navParams.get('user');
    this.loading = this.loadingCtrl.create();
    this.device = localStorage.getItem('Device');
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    // this.cons = this.navParams.get('cons');
    // this.data = JSON.parse(localStorage.getItem('Project'));
    var data = this.navParams.get('data');
    this.parm = this.navParams.get('data');
    this.cons = data.cons;
    this.entitys = data.entity;
    this.project_no = data.projectNo;
    this.project_name = data.projectName;
    // this.view = true;
    this.view2 = true;


    this.loadProperty('');
    this.loadSales('');

    this.reportForm = new FormGroup({
      cons : new FormControl(this.cons),
      user : new FormControl(localStorage.getItem('UserId')),
      salez : new FormControl(),
      propertys : new FormControl(),
    });

    this.loading.present();
  }

  logoutAPi(){
    this.loading.present();
    let UserId = localStorage.getItem('UserId');
    this._authService.logout().subscribe(
      (x:any) => {
        console.log(x);
              if(x.Error == true) {
                  this.showAlert("Warning!", x.Pesan);
                  this.loading.dismiss();
              }
              else {
                this.loading.dismiss();
                localStorage.clear();
                  if(this.device=='android'){
                      navigator['app'].exitApp();
                  }else{//ios and web
                      this._app.getRootNav().setRoot(MyApp);
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

    this.http.get(this.url_api + "c_reservate/getDataSales/" +  this.cons + "/" + this.entitys + "/" + this.project_no, { headers: this.hd })
      .subscribe(
        (x: any) => {
          console.log(x);
          if (x.Error == true) {
            if (x.Status == 401) {
              // this.showAlert("Warning!", x.Pesan);
              this.logoutAPi();
              this.loading.dismiss();
              // this.nav.pop();
            }
            else {
              this.av = false;
              this.reportss = [];
              this.rpt = this.reportss;
              // alert("No Data");
              // this.showAlert("Warning!", "No Data");
              this.loading.dismiss();
              // this.nav.pop();
            }
          }
          else {

            x = x.Data;
            var data = x;
            var date1 = ''
            data.forEach(val => {

              // console.log(x);
              date1 = val.sales_date.substr(0, 10);
              this.reportss.push({
                lotno: val.lot_no,
                agntname: val.NAMA,
                salesname: val.sales,
                slsdate: date1,
                propdescs: val.property_descs,
                lotdescs: val.lot_type_descs,
                directs: val.direction_descs,
                payplan: val.payment_plan_descs,
                sellprc: val.sell_price
                // url_path: val.http_add,
                // entity_name: val.entity_name,
                // cons_project:val.db_profile
              });
            });
            this.rpt = this.reportss;
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

  loadProperty(parm:any) {
    // console.log('ppp',this.data);
    this.http.get(this.url_api+"c_reservate/getProperty/" + this.cons + "/" + this.entitys + "/" + this.project_no , {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            // this.nats = [{
            //   nationality_cd: '', descs: ''
            // }];
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);
          var data = x.Data;

          data.forEach(element => {
            if(element.property_cd == parm){
              if(this.view){
                this.propertys = element.descs;
              }
              else {
                this.reportForm.get('propertys').setValue(element);
              }
            }
          });

          this.propss = data;
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
          this.showAlert("Error!", errS);
      }
    );
  }

  loadSales(parm:any) {

    this.http.get(this.url_api+"c_reservate/getSales/" + this.cons + "/" + this.entitys, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            // this.nats = [{
            //   nationality_cd: '', descs: ''
            // }];
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);
          var data = x.Data;

          data.forEach(element => {
            if(element.group_cd == parm){
              if(this.view2){
                this.salez = element.agent_name;
              }
              else {
                this.reportForm.get('salez').setValue(element);
              }
            }
          });

          this.saless = data;
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
          this.showAlert("Error!", errS);
      }
    );
  }



  getItems(ev: any) {
    let val = ev.target.value;

    if(!val){
      this.reportss = this.rpt;
    }
    else {
      this.reportss = this.rpt.filter((item) => {
        var searched = item.agntname + item.lotno + item.salesname;
        // return item.agntname.toLowerCase().indexOf(val.toLowerCase()) > -1;
        return (searched.toLowerCase().includes(val.toLowerCase()));
      });
    }
  }

  GetReport(ev:any):void{
    // console.log(ev);
    // this.loading.present();
    this.view.dismiss(ev);
  }

  dismiss() {
    this.view.dismiss();
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
