import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
// import { ImageViewerController } from 'ionic-img-viewer';
import { ProfilePage } from '../profile/profile';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from 'ionic-angular';
import { WalkthroughPage } from '../walkthrough/walkthrough';

declare var google:any;

@Component({
  selector: 'napdetails-page',
  templateUrl: 'napdetails.html'
})
export class NapDetails {
  @ViewChild('map') mapRef: ElementRef;
  map:any;

  projects:any[] = [];
  // _imageViewerCtrl: ImageViewerController;
  loading:any;
  display: string;
  project:any;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  link_iframe:any ;
  ErrorList:any;

  images = [
    './assets/images/maps/noimage.png'
  ];
  plans = [
    './assets/images/maps/noimage.png'
  ];
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  news:any[] = [];

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public socialSharing: SocialSharing,
    // public imageViewerCtrl: ImageViewerController,
    private photoViewer:PhotoViewer,
    private file: File,
    public sanitizer:DomSanitizer,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController


  ) {
    this.project = navParams.get('project');
    this.loading = this.loadingCtrl.create();
    // this._imageViewerCtrl = imageViewerCtrl;
    this.loadData();
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

    // console.log(this.mapRef);
    // console.log(this.project);
  }

  ionViewDidLoad(){

    // console.log(this.mapRef);
    // this.showMap();
  }
  // showMap(){
  //   const location = new google.maps.LatLng(-6.208133, 106.843636);
  //   //map option
  //   const options = {
  //     center:location,
  //     zoom:15,
  //     mapTypeId:'terrain',
  //     title:'IFCA Software Jakarta'
  //   }
  //   this.map =  new google.maps.Map(this.mapRef.nativeElement,options);
  //   this.addMarker(location,this.map);
  // }
  addMarker(position,map){
    return new google.maps.Marker({
      position,
      map
    });
  }
  presentImage(myImage,judul:any) {
    // console.log(myImage);
    // const imageViewer = this._imageViewerCtrl.create(myImage);
    // imageViewer.present();

    if(myImage.search('assets/images') == -1){
      //image from API
      myImage = myImage.replace(' ', '%20');
    }
    else {
      //image from LOCAL
      myImage = this.file.applicationDirectory + 'www'+myImage.substring(1,myImage.length);
    }
    this.photoViewer.show(
      myImage,
      judul,
      {share:false}
    );
  }

  loadData(){
    var idpromo = localStorage.getItem('id');
    this.loading.present();
    var P = false
    var Y = false
    if (idpromo != null) {
      this.http.get(this.url_api+"c_newsandpromo/getDatabyID/" + this.cons + "/" + idpromo , {headers:this.hd})
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              // alert(x.Pesan);
              // alert("Ntar Logout");
              this.logoutAPi();
              this.loading.dismiss();
              //Langsung Logout
            }
            else {
              this.showAlert('Warning!',x.Pesan);
            }
          }
          else {
            x = x.Data[0];
            if(x.attach_type == 'P'){
              P = true
              Y = false
            }
            else{
              P = false
              Y = true
            }
            console.log(x)
            this.link_iframe = this.sanitizer.bypassSecurityTrustResourceUrl(x.youtube_link);
            this.news.push(
              {
                name:x.descs,
                pict: x.picture,
                sub: x.subject,
                con: x.content,
                type: x.attach_type,
                date: x.start_date,
                id: x.id,
                youtube : this.link_iframe,
                p:P,
                y:Y
              }
            );
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
    }

  }

  goToProfile(event, item) {
    this.nav.push(ProfilePage, {
      user: item
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
