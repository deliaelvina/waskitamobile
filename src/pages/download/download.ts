import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, ToastController, App, Platform } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
// import { ReservationUnitPage } from './unit';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../auth/auth.service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
import { FileTransferObject, FileTransfer } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';

@Component({
  selector: 'download-page',
  templateUrl: 'download.html',
  providers: [FileTransfer, FileTransferObject, File],
})
export class DownloadPage {
  download:any[] = [];
  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons:any;
  device:string;

  project_name: any;
  project_pict:any;

  available: boolean = true;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  ErrorList:any;
  storageDirectory:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    private _app: App,
    private _authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    private socialSharing: SocialSharing,
    public platform: Platform,
    private file: File,
    private transfer: FileTransfer,
    private fileOpener: FileOpener,
  ) {
    // var data= JSON.parse(localStorage.getItem('data'));
    var data = this.navParams.get('data');
    // console.log(data);
    this.project_name = data.projectName;
    this.project_pict = data.projectPict;
    this.cons = data.cons;
    this.device = localStorage.getItem('Device');
    this.loading = this.loadingCtrl.create();

    this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = (this.file.documentsDirectory||this.file.dataDirectory)+"Path_Waskita";
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = this.file.externalDataDirectory;
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });
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

  ionViewDidLoad() {
    // alert("hee");
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });

    this.loading.present();

    this.http.get(this.url_api+"c_download2/getFile/" + this.cons , {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            this.available = false;
            this.loading.dismiss();
          }
        }
        else {
          var data = x.Data;
          this.available = true;
          // console.log(data);

          data.forEach(val => {

            this.download.push({
              id : val.rowID,
              desc : val.descs,
              path: val.url,
              url : this.url_api+"pdf/"+val.url
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
          this.showAlert("Error!", errS);
      }
    );
    // this.loading.dismiss();
  }

  share(file:any){
    // console.log('file => '+JSON.stringify(file));
    this.loading = this.loadingCtrl.create();
    this.loading.present().then(() => {
      this.socialSharing.share(file.desc, file.desc, file.url, '')
      .then(() => {
        //success
        this.loading.dismiss();
      }).catch(() => {
        //error
        this.loading.dismiss();
      })
    });
  }

  dw(file:any){
    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : "Download PDF",
      subTitle : "Do You Want To Download It?",
      buttons : [
        {text : 'No'},
        {text : 'Yes', handler: () => {
          this.loading = this.loadingCtrl.create();
          this.loading.present().then(() => {
            const fileTransfer: FileTransferObject = this.transfer.create();
            var url = encodeURI(file.url);
            fileTransfer.download(url, this.storageDirectory + '/'+file.path).then((entry) => {
              let urlpdf = entry.toURL();
              this.fileOpener.open(urlpdf, 'application/pdf').then(() => {
                this.loading.dismiss();
              }, (err) => {
                // handle error
                this.ErrorList = this.ErrorList.filter(function(er){
                    return er.Code == err.status;
                });

                var errS;

                if(this.ErrorList.length == 1 ){
                  // alert('a');
                  errS = this.ErrorList[0].Description;
                }else{
                  // alert('b');
                  errS = err;
                }
                this.showAlert("Download failed!", JSON.stringify(errS));
                this.loading.dismiss();
                })
                .catch(e => {
                  // alert('eror bray:'+JSON.stringify(e))
                  this.showAlert("Error!", JSON.stringify(e));
                });
            //end of file opener

            }, (err) => {
              // handle error
              this.ErrorList = this.ErrorList.filter(function(er){
                  return er.Code == err.status;
              });

              var errS;

              if(this.ErrorList.length == 1 ){
                // alert('a');
                errS = this.ErrorList[0].Description;
              }else{
                // alert('b');
                errS = err;
              }
              this.showAlert("Download failed!", JSON.stringify(errS));
              this.loading.dismiss();
              });
          });
        }}
      ]
    });

    warning.present();
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
