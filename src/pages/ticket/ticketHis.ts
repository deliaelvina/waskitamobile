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
  selector: 'ticket-his',
  templateUrl: 'ticketHis.html'
})
export class TicketHis {
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  
  main_page: { component: any };
  loading:any;
  url_api = environment.Url_API;
  cons: any; 
  ErrorList:any;
  error:any;
  
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
