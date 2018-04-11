import { Component } from '@angular/core';
import { MenuController, SegmentButton, App, NavParams, LoadingController} from 'ionic-angular';
import 'rxjs/Rx';
//buat form
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup , FormControl } from '@angular/forms';
import { PasswordValidator } from '../../components/validators/password.validator';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormService } from '../../auth/form.service';
import { ProfileService } from '../profile/profile.service';
// import { UserModel } from '../profile/profile.model';
import { NextChangePasswordPage } from './nextchangepass';
// import {Md5} from 'ts-md5/dist/md5';
@Component({
    selector: 'change-password-page',
    templateUrl: 'change-password.html'
    // providers: [Md5]
  })
  export class ChangePasswordPage {
    // list: Array<UserModel> = [];
    url_api = environment.Url_API;
    cons = environment.cons_mobile;
    email:any;
    userid:any;
    change_password:FormGroup;
    hd = new HttpHeaders({
      Token : localStorage.getItem("Token")
    });
    
    dt = {
      Password : ''
    };
    constructor(
      public menu: MenuController, 
      public navParams: NavParams,
      public app: App,
      public profileService: ProfileService,
      private http: HttpClient,
      // private res: Response,
      //buat form
      public navCtrl: NavController
      // ,private _authService: AuthService
      // public formBuilder: FormBuilder
      ,private formservice: FormService
      // private _md5: Md5
    )
    {
      this.email = localStorage.getItem('User');
      this.userid = localStorage.getItem('UserId');
      this.change_password = new FormGroup({
        Password:new FormControl('',Validators.required)
      });
    //   this.list = navParams.get('list');
    }

    nextchange(){
      let hash2 = localStorage._md5.appendStr('password').end();
      var datas = this.change_password.value;
    // var datas = this.dt.value;
    datas.Uid = localStorage.getItem('UserId');
      // this.profileService.getData()
      this.formservice.Change_Password(this.change_password.value).subscribe(
        (data:any)=>{
          // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
          
        
          
          if(data.Error){//error login
            alert(data.Pesan);
            //tolong di ganti toast iah han :) - udah di ganti ya bang :)
            // let toast = this.toastCtrl.create({
            //   message: currentUser.Pesan,
            //   duration: 3000,
            //   position: 'top'
            // });
          
            // toast.onDidDismiss(() => {
            //   console.log('Dismissed toast');
            // });
            // toast.present();
            
            // localStorage.removeItem('currentUser');
          }else{
            // localStorage.removeItem('currentUser');
            alert(data.Pesan);
            this.menu.close();
    this.app.getRootNav().push(NextChangePasswordPage);
            //goto menu
            // this.nav.setRoot(this.main_page.component);
          }
        },
        error=>{
  
        }
      );
    
    }
  
    // ionViewDidEnter() {
    //   // the root left menu should be disabled on this page
    //   this.menu.enable(false);
    // }
  
    // ionViewWillLeave() {
    //   // enable the root left menu when leaving the tutorial page
    //   this.menu.enable(true);
    // }
  }