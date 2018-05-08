import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, MinLengthValidator } from '@angular/forms';
import { NavController, NavParams, LoadingController, Platform, ToastController,AlertController } from 'ionic-angular';

import 'rxjs/Rx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { ImagePicker } from '@ionic-native/image-picker';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { ListingPage } from '../listing/listing';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';


declare var cordova: any;

@Component({
  selector: 'simulasi-page',
  templateUrl: 'simulasi.html'
})
export class SimulasiPage {
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  reserveForm: FormGroup;
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  main_page: { component: any };
  loading:any;
  url_api = environment.Url_API;
  cons: any; 
  ErrorList:any;
  error:any;kredit1:any;
  images:any;bunga1:any;waktu1:any;
  bunga:any;kredit:any;waktu:any;angsuran:any;
  hitung:any=false;
  
  constructor(
    public nav: NavController,
    private http: HttpClient,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    public imagePicker: ImagePicker,
    private _errorService: ErrorhandlerService
  ) {
    this.main_page = { component: TabsNavigationPage };
    this.loading = this.loadingCtrl.create();
    // console.log(this.data);
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    
  }

  ionViewDidLoad() {
    // this.loading.present();
    // this.loadData();
  }
  format(valString) {
      if (!valString) {
          return '';
      }
      let val = valString.toString();
      const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
      return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR)

  }
  unFormat(val) {
      if (!val) {
          return '';
      }
      val = val.replace(/^0+/, '').replace(/\D/g,'');
      if (this.GROUP_SEPARATOR === ',') {
          return val.replace(/,/g, '');
      } else {
          return val.replace(/\./g, '');
      }
  }
  formatdec(num){
    console.log(num);
    num = num.replace(/\D/g, '');
    return (num / 100).toFixed(2);
    // return Number.parseFloat(num).toFixed(2);
  }
  hitungKPR(){
    console.log(this.bunga);
    this.bunga1 = this.bunga;
    this.waktu1 = this.waktu;
    this.bunga1/=1200;
    this.waktu1*=12;  
    this.kredit1 = this.unFormat(this.kredit);
    // console.log(this.unFormat(this.kredit));
    this.angsuran = (this.kredit1*this.bunga1)*(1/(1-(1/(Math.pow((1+this.bunga1),this.waktu1)))));
    // this.angsuran = Math.round(this.angsuran * 100) / 100;
    this.angsuran = Math.round(this.angsuran);
    // this.angsuran = M(this.angsuran).toFixed(2);
    console.log(this.angsuran);
    this.angsuran = this.format(this.angsuran);

    if(this.bunga==null || this.bunga==''){
      if(this.kredit==null||this.kredit==''){
        if(this.waktu==null||this.waktu==''){
          this.hitung=false;
          let toast = this.toastCtrl.create({
            message: "Waktu is required.",
            duration: 3000,
            position: 'top'
          });
    
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
          toast.present();
        }
        let toast = this.toastCtrl.create({
          message: "Kredit is required.",
          duration: 3000,
          position: 'top'
        });
  
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
        toast.present();  
      }
      let toast = this.toastCtrl.create({
        message: "Bunga is required.",
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
    } else {
      this.hitung=true;
    }
    
  }
  showAlert(title:any, subTitle:any, act:any) {
    var bah:any;
    if(act == 'back'){
      bah = {text : 'Ok', handler : () => {
        this.nav.pop();
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
