import { Component } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, AlertController, App } from 'ionic-angular';
// import { ImageViewerController } from 'ionic-img-viewer';
import { ProfilePage } from '../profile/profile';
import { DomSanitizer} from '@angular/platform-browser';

import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { ToastController } from 'ionic-angular';
//error handle
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { ContactPage } from '../productInfo/contact/contact';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { empty } from 'rxjs/Observer';
import { WalkthroughPage } from '../walkthrough/walkthrough';
import { AuthService } from '../../auth/auth.service';
import { MyApp } from '../../app/app.component';


declare var cordova: any;

@Component({
  selector: 'project-details-page',
  templateUrl: 'projectdetails.html',
  providers: [FileTransfer, FileTransferObject, File]
})
export class ProjectDetailsPage {

  @ViewChild(Slides) slides: Slides;
  projects:any[] = [];
  // _imageViewerCtrl: ImageViewerController;
  loading:any;
  display: string;
  project:any;
  url_api = environment.Url_API;
  // cons = environment.cons_pb;
  cons = localStorage.getItem('cons_project');
  ErrorList:any;
  parm:any;
  images = [
    this.url_api+'images/noimage.png'
  ];
  pro = {
    projectName:'',
    entity:'',
    projectNo:'',
    cons:''};
  plans = [
    this.url_api+'images/noimage.png'
  ];
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  prodetails:any[] = [];
  overview:any='-';
  feature:any='-';brochure:any;
  coords:any;ytb:any;ytb_url:any;
  coords_name:any='-';device:string;
  coords_address:any='-';
  amenitiesO:string='-';
  amenitiesI:string='-';
  amenitiesS:string='-';
  amenitiesH:string='-';
  url:any;
  storageDirectory: string = '';
  frontData:any;
  where:any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public socialSharing: SocialSharing,
    // public imageViewerCtrl: ImageViewerController,
    private photoViewer:PhotoViewer,
    private sanitizer: DomSanitizer,
    public platform: Platform,
    private transfer: FileTransfer, private file: File,
    private fileOpener: FileOpener,
    private _app: App,
    private _authService: AuthService,
    // private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService
  ) {
    this.frontData = JSON.parse(localStorage.getItem('menus'));
    if(this.frontData){
      // alert('a');
      this.where = this.cons + "/" + this.frontData.entity+ "/" + this.frontData.projectNo;
      // this.project = this.frontData;
      this.pro.projectName = this.frontData.projectName;
      this.pro.entity = this.frontData.entity;
      this.pro.projectNo = this.frontData.projectNo;
      this.pro.cons = this.frontData.cons;
    }
    else {
      // alert('b');
      this.project = navParams.get('project');
      // console.log(this.project);
      this.where = this.cons + "/" + this.project.entity+ "/" + this.project.project;
      this.pro.projectName = this.project.descs;
      this.pro.entity = this.project.entity;
      this.pro.projectNo = this.project.project;
      this.pro.cons = this.project.cons_project;
    }

    this.display ="I";
    this.loading = this.loadingCtrl.create();
    this.device = localStorage.getItem('Device');
    // this._imageViewerCtrl = imageViewerCtrl;
    // this.parm =  this.navParams.get('data');
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

  // goToSlide() {
  //   this.slides.slideTo(2, 500);
  // }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    // console.log('Current index is', currentIndex);
  }
  ionViewWillEnter(){
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    this.loadData();

  }

  ionViewWillLeave(){
    localStorage.removeItem('cons_project');
  }

  ionViewDidLeave(){
    localStorage.removeItem('cons_project');
  }

  presentImage(myImage,from:any) {
    // console.log(myImage);
    // const imageViewer = this._imageViewerCtrl.create(myImage);
    // imageViewer.present();
    var judul = '';
    if(from=='project'){
      judul = this.pro.projectName;
    } else if (from=='plan'){
      judul = this.pro.projectName+' Plans';
    } else {
      judul = this.pro.projectName;
    }

    if(myImage.search('assets/images') == -1){
      //image from API
      myImage = myImage.replace(/ /gi, '%20');
    }
    else {
      if (this.platform.is('ios')) {
        myImage = (this.file.documentsDirectory||this.file.dataDirectory)+ 'www'+myImage.substring(1,myImage.length);
      }
      else if(this.platform.is('android')) {
        myImage = this.file.applicationDirectory + 'www'+myImage.substring(1,myImage.length);
      }
      //image from LOCAL
    }

    // console.log(myImage);
    // return;
    this.photoViewer.show(
      myImage,
      judul,
      {share:false}
    );
  }

  downloadpdf() {
    this.loading = this.loadingCtrl.create();
    this.loading.present().then(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      var url = encodeURI(this.brochure);

      fileTransfer.download(url, this.storageDirectory + '/brochure.pdf').then((entry) => {
        let urlpdf = entry.toURL();
        // alert(urlpdf);

        // alert(this.storageDirectory);

        // alert('hi');
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
          this.showAlert("Download failed!", JSON.stringify(errS),'donothing');
          this.loading.dismiss();
          })
          .catch(e => {
            alert('eror bray:'+JSON.stringify(e))
          });
       //end of file opener

      }, (err) => {
        // handle error
        this.ErrorList = this.ErrorList.filter(function(er){
            return er.Code == err.status;
        });

        var errS;

        if(this.ErrorList.length == 1 ){
          alert('a');
          errS = this.ErrorList[0].Description;
        }else{
          alert('b');
          errS = err;
        }
        this.showAlert("Download failed!", JSON.stringify(errS),'donothing');
        this.loading.dismiss();
        });
    });

  }

  loadData(){
    // console.log(this.project);
    this.loading.present().then(() => {
      this.http.get(this.url_api+"c_reservation/getDataDetails/" + this.where , {headers:this.hd} )
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              // this.showAlert("Warning!", x.Pesan,'');
              this.logoutAPi();
              this.loading.dismiss();
            }
            else {
              this.showAlert("Warning!", x.Pesan,'');
              this.loading.dismiss();
              // this.nav.pop();
            }
          }
          else {

            var data = x.Data;


            if(data.project!=null){
              this.prodetails = data.project[0];
              this.coords = data.project[0].coordinat_project;
              this.coords_name = data.project[0].coordinat_name;
              this.coords_address = data.project[0].coordinat_address;
              // console.log(this.coords);
              this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.coords);
              // console.log(this.url);
            }
            if(data.feature!=null){
              this.feature = data.feature[0];
            }
            if(data.overview!=null){
              this.overview = data.overview[0];
              this.ytb = data.overview[0].youtube_link;
              // console.log(this.ytb);
              this.ytb_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.ytb);
              this.brochure = data.overview[0].url_brochure;
            }

            var amen = data.amenities;
            if(amen!=null){
              amen.forEach(val => {

                if(val.amenities_type == 'I'){
                  this.amenitiesI = val.amenities_info;

                }
                if(val.amenities_type == 'S'){
                  this.amenitiesS = val.amenities_info;

                }
                if(val.amenities_type == 'H'){
                  this.amenitiesH = val.amenities_info;

                }
                if(val.amenities_type == 'O'){
                  this.amenitiesO = val.amenities_info;

                }
              });
            }
            // console.log(amen);

            // console.log(this.amenitiesI);//console.log(this.imagess);
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
          this.showAlert("Error!", errS,'');
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
            // this.nav.pop();
        }
      );//end of getdata

      this.http.get(this.url_api+"c_reservation/getGallery/" + this.where, {headers:this.hd} )
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              // console.log('napasi');
              // this.showAlert("Warning!", x.Pesan,'');
              this.loading.dismiss();
              this.logoutAPi();
            }
            else {
              // console.log('dimari');
              this.showAlert("Warning!", x.Pesan,'');
              this.loading.dismiss();
              // this.nav.pop();
            }
          }
          else {

            var data = x.Data;

            var gallery = data.gallery;
            if(gallery!=null){
              this.images=[];
              gallery.forEach(val => {
                this.images.push(val.gallery_url);
              });
            }


            var dataplans = data.plans;
            if(dataplans!=null){
              this.plans=[];
              dataplans.forEach(val => {
                this.plans.push(val.plan_url);
              });
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


            // console.log('apaluu');
            this.showAlert("Error!", errS,'');
        }
      );//end of getgallery
    });//end of loading present


  }
  goToProfile(event, item) {
    this.nav.push(ProfilePage, {
      user: item
    });
  }
  contact(){
    // alert('a');
    // console.log(this.project);
    // var project
    // var lot = "";
    // if (this.parm.studios) {
    //   lot = this.parm.lot_type_desc;

    // }else{
    //   lot = this.parm.lot_descs;
    // }
    var desc="Saya tertarik reservasi\n"+this.pro.projectName+"\n";
    this.nav.push(ContactPage,{data:this.pro, desc:desc});
  }


  logoutAPi(){
    this.loading.present();
    let UserId = localStorage.getItem('UserId');
    this._authService.logout().subscribe(
      (x:any) => {
        console.log(x);
              if(x.Error == true) {
                  this.showAlert("Warning!", x.Pesan,'');
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
                this.showAlert("Error!", errS,'');
            }
    );

    }
  showAlert(title:any, subTitle:any, act:any) {
    var cmd:any;
    if(act == 'donothing'){
      cmd = {text : 'Ok'};
    }
    else {
      cmd = {text : 'Ok', handler : () => {
        this.nav.pop();
      }};
    }
    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : title,
      subTitle : subTitle,
      buttons : [
        cmd
      ]
    });

    warning.present();
  }

}
