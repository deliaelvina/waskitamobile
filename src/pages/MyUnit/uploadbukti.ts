import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, MinLengthValidator } from '@angular/forms';
import { NavController, NavParams, LoadingController, Platform, ToastController, AlertController } from 'ionic-angular';
import { UsernameValidator } from '../../components/validators/username.validator';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhoneValidator } from '../../components/validators/phone.validator';
import { Country } from '../form-validations/form-validations.model';
import { ListingPage } from '../listing/listing';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { CameraPage } from '../camera/camera';
import { FileUploadOptions, FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

declare var cordova: any;

@Component({
  selector: 'uploadbukti-page',
  templateUrl: 'uploadbukti.html'
})
export class UploadBuktiPage {
  reserveForm: FormGroup;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  main_page: { component: any };

  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons: any;

  selected_image:any;
  ErrorList:any;

  base64Image:string;
  pict:any;
  imgBukti:any = null;

  parm:any;parmhd:any;
  data:any;
  validation_messages:any;

  rowID:any;


  error:any;
 
  images:any;
  pictPost:any;
  storageDirectory: string = '';
  avPict:boolean = false;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public imagePicker: ImagePicker,
    public cropService: Crop,
    public platform: Platform,
    private toastCtrl: ToastController,
    private _errorService: ErrorhandlerService,
    public camera: Camera,
    private fileTf:FileTransfer,
  ) {
    this.main_page = { component: TabsNavigationPage };
    this.loading = this.loadingCtrl.create();
    this.cons = this.navParams.get('cons');
    this.parm = this.navParams.get('datas');
    this.parmhd = this.navParams.get('data1');
    this.imgBukti = null;

    this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
      if(!this.platform.is('cordova')) {
        return false;
      }

      if (this.platform.is('ios')) {
        this.storageDirectory = cordova.file.documentsDirectory;
      }
      else if(this.platform.is('android')) {
        this.storageDirectory = cordova.file.dataDirectory;
      }
      else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });

    this.pict = [
      {for:'bukti', img:'', name:''}
    ];

    this.pictPost = {
      imgBukti : ''
    };

    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    console.log(this.parmhd);
    this.reserveForm = new FormGroup({
      rowID : new FormControl(this.parm.rowID),
      email : new FormControl(localStorage.getItem('User')),
      name : new FormControl(localStorage.getItem('Name')),
      entity : new FormControl(this.parmhd.entity.trim()),
      project : new FormControl(this.parmhd.project.trim()),
      debtor : new FormControl(this.parmhd.debtor_acct),
      cons : new FormControl(this.cons),
      pict: new FormControl(this.pictPost)
    });

  }

 

  ionViewDidLoad() {
    // alert("hee");
    // this.loading.present();
  }

  ionViewWillEnter(){
    // console.log('enter');
    let images = JSON.parse(localStorage.getItem('image'));
    var rand = Math.floor(Math.random() * 100);
    // console.log(images);
    if(images){
      this.avPict = true;
      let z = images.for;
      if(z == 'bukti'){
        this.imgBukti = images.imgHere;
        this.pict[0].img = images.imgHere;
        this.pict[0].name = 'bukti_ID_'+rand+'.jpg';
        this.pictPost.imgBukti = this.url_api+'images/myunit/bukti_ID_'+rand+'.jpg';
      }
     
    }
  }


  addZero(i:any){
    if(i < 10){
      i = '0'+i;
    }

    return i;
  }

  loadData(){
   
  }

  openCamera(what:any,img:any){
    this.nav.push(CameraPage,{from:what, image:img});
  }


  onSubmit(data:any) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();

    this.save(data);
   
  }

  save(data:any){
  
    if(!this.reserveForm.valid){
      let toast = this.toastCtrl.create({
        message: "Your Data is Not Valid.",
        duration: 1000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
    }
    else {
      // console.log(data);
      var cnt:number = 0;
      // var all = this.pict.length;
      if(this.avPict){
        this.pict.forEach(img => {
          cnt ++;
          // if(img.img && img.img != ''){
            this.upload(img.for, img.img, img.name)
            .then((datas) => {
              var x = JSON.parse(datas.response);
              if(x.Error == true) {
                if(x.Status == 401){
                  this.showAlert("Warning!", x.Pesan,'');
                  this.loading.dismiss();
                }
                else {
                  // alert(x.Pesan);
                  this.showAlert("Warning!", x.Pesan,'');
                  this.loading.dismiss();
                }
              }
              else {
                //Success


              }
              }, (err) => {
        
              }
            )
         
        });
      }

      this.actSave(data);
    }
  }

  upload(what:any,pict:any, name:any){
    const transfer:FileTransferObject = this.fileTf.create();

      let option : FileUploadOptions = {
        fileKey: 'photo',
        fileName: name,
        chunkedMode: false,
        httpMethod: 'post',
        mimeType: 'image/jpeg',
        headers: {'Token':localStorage.getItem("Token")}
      };

      return transfer.upload(pict, this.url_api+'c_myunits/upload/', option);

  }

  actSave(data:any){
    // alert('hi save');
    this.http.post(this.url_api+"c_myunits/save/" , data, {headers:this.hd})
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            this.showAlert("Warning!", x.Pesan,'');
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            this.showAlert("Error!", x.Pesan,'');
            this.loading.dismiss();
          }
        }
        else {
          //Success
          localStorage.removeItem('image');
          this.loading.dismiss();
          this.showAlert("Success!", x.Pesan, 'menu');
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

  showAlert(title:any, subTitle:any, act:any) {
    var bah:any;
    if(act == 'menu'){
      bah = {text : 'Ok', handler : () => {
        this.nav.pop();
        // localStorage.removeItem('data');
      }};
    }
    else {
      bah = {text : 'Ok'};
    }
    let warning = this.alertCtrl.create({
      cssClass: 'alert',
      title : title,
      subTitle : subTitle,
      buttons : [
        bah
      ]
    });

    warning.present();
  }



}
