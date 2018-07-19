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
  selector: 'ticket-filter',
  templateUrl: 'ticketFilter.html'
})
export class TicketFilter {
  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  
  main_page: { component: any };
  loading:any;
  url_api = environment.Url_API;
  cons: any; 
  ErrorList:any;
  error:any;
  parm : any;
  ddPost : any;
  
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
    this.parm = this.navParams.get('data');
    // console.log(this.parm);
    this.cons = this.parm.cons;
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
    
  }

  ionViewDidLoad() {
    this.loading.present();
    this.loadDD();
  }

  loadDD(){
    this.ddPost = {
      'cons' : this.cons,
      'group' : localStorage.getItem('Group'),
      
    }
    this.http.post(this.url_api+"c_ticket/getDD/", this.ddPost , {headers:this.hd} )
    .subscribe(
      (x : any) => {
        this.loading.dismiss()
      },
      (err) => {
        this.loading.dismiss()
      }
    )
  }

  optionSelected(x){

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
