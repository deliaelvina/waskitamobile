import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { GoogleLoginService } from '../google-login/google-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { AuthService } from '../../auth/auth.service';
import { ToastController } from 'ionic-angular';
//error handle
import { ErrorStatusModel } from '../../providers/errorhandler/errorhandler.model';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { environment } from '../../environment/environment';

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class LoginPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;
  device:string;
  //error handle
  // ErrorList: ErrorStatusModel = new ErrorStatusModel();
  ErrorList:any;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
    public googleLoginService: GoogleLoginService,
    public twitterLoginService: TwitterLoginService,
    public loadingCtrl: LoadingController
    ,private _authService: AuthService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private _errorService: ErrorhandlerService
    ,private facebook: Facebook
    ,public googlePlus: GooglePlus
    ,public platform:Platform
  ) {
    platform.ready().then((source) => {
      if (this.platform.is('android')) {
        localStorage.setItem('Device', 'android');
        this.device = 'android';
        // alert("running on Android device!");
      }
      if (this.platform.is('ios')) {
        this.device = 'iOS';
        localStorage.setItem('Device', 'iOS');
      }
      if (this.platform.is('mobileweb')) {
        this.device = 'web';
        localStorage.setItem('Device', 'web');
      }
      // alert(source);
    });
    this.main_page = { component: TabsNavigationPage };
    this.loading = this.loadingCtrl.create();
    this.login = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });


  }
  ionViewDidLoad() {
    this._errorService.getData()
    .then(data=>{
      // console.log(data.Error_Status);

      this.ErrorList = data.Error_Status;
      // this.ErrorList.Code = data.Code;
      // this.ErrorList.Description = data.Description;
    });
  }

  doLogin(){
    // this.nav.setRoot(this.main_page.component);
    // localStorage.setItem("isLogin","true");
    // console.log(this.login.value);
    // console.log(this.ErrorList);
    // console.log(this.ErrorList.Error_Status[0]);

    this.loading.present();
    this._authService.Login(this.login.value).subscribe(
      result=>{
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loading.dismiss();
        if(currentUser.Error){//error login
          this.showAlert("Warning!", currentUser.Pesan);

          localStorage.removeItem('currentUser');
        }else{
          localStorage.removeItem('currentUser');

          let reset:boolean=false;
          if(localStorage.getItem('isReset')=='1'){
            reset=true;
          }

          if(reset){
            localStorage.removeItem("isLogin");
            //goto reset password
            // alert('ResetPassword');
            this.nav.setRoot(ResetPasswordPage);
              // this.nav.push(ResetPasswordPage);
          }else{
             //goto menu
            //  alert('tes');
              this.nav.setRoot(this.main_page.component);
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
  LoginSosmed(email:string,Fr:string,usId:string){
    // this._authService.LoginSosmed(profile['email'],"FB")
    // alert(email);
    // this.showAlert("Error!", email);
    if(Fr=='GMAIL'){
      this.googlePlus.logout();
    }else{
      this.facebook.logout();
    }
    this._authService.LoginSosmed(email,Fr,usId)
    .subscribe(

      (Res)=>{
        // this.showAlert("INFO",JSON.stringify(Res));
        // alert('result =>'+JSON.stringify(Res));
        // this.showAlert("Error!", '12345');
        this.loading.dismiss();
        if(Res.Error==true){
          // alert(Res.Pesan);
          this.showAlert("Error!", Res.Pesan);
        }else{
          localStorage.setItem('MenuDash', JSON.stringify(Res.Data.DashMenu));
              localStorage.setItem('Group', Res.Data.Group);
              localStorage.setItem('UserId', Res.Data.UserId);
              localStorage.setItem('Name', Res.Data.name);
              localStorage.setItem('Token', Res.Data.Token);
              localStorage.setItem('User', Res.Data.user);
              localStorage.setItem("isLogin","true");
              localStorage.setItem("isReset",Res.Data.isResetPass);
              localStorage.setItem("AgentCd",Res.Data.AgentCd);
        // console.log(data);
        this.nav.setRoot(this.main_page.component);
        }

      },
      (err)=>{
        // alert('error =>'+JSON.stringify(err));
        this.loading.dismiss();
        this.showAlert("Error!", err);
        // console.log(err);
      }
    );
  }
  loginWithFB() {
    // alert('tes');
    this.loading.present();
    this.facebook.login(['public_profile','email']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', [])
      .then(profile => {
        this.loading.dismiss();
        this.LoginSosmed(profile['email'],'FB',profile['id']);
      });
    }).catch(err =>{

      this.loading.dismiss();
  // var errS;
  //   //filter klo error'a tidak ada di array error
  //   if(this.ErrorList.length == 1 ){
  //     errS = this.ErrorList[0].Description;
  //   }else{
  //     errS = err;
  //   }
  //   this.showAlert("ERROR!",errS);

    });
  }
  goToSignup() {
    this.nav.push(SignupPage);
  }

  goToForgotPassword() {
    this.nav.push(ForgotPasswordPage);
  }
  googleSignUp(){
    // alert('haha');
    // this.showAlert("INFO!","tes");
    // this.loading = this.loadingCtrl.create();
    this.loading.present();

    let env = this;
    if(this.device=='iOS'){//ios
      //Check Is Login Or Not
      this.googlePlus.trySilentLogin({

      }).then((res) => {
        alert('cek login');
        this.LoginSosmed(res['email'],'GMAIL',res['userId']);
      },(error) => {
        this.googlePlus.login({
          // 'webClientId': environment.google_web_client_id,
          // 'offline': true,
          // 'scopes':'profile email'
        }).then((ress) => {
          this.loading.dismiss();
          alert('berhasil login');
            this.LoginSosmed(ress['email'],'GMAIL',ress['userId']);
          },(errors) => {
            this.loading.dismiss();
            alert('Failed2 => ' + JSON.stringify(errors));
          });
      });
    }else{//android
      
    // this.googlePlus.trySilentLogin({
    //   }).then((res) => {
    //     // alert('cek login');
    //     // alert('sukses => ' + JSON.stringify(res));
    //     // this.LoginSosmed(res['email'],'GMAIL',res['userId']);
    //   //   this.googlePlus.logout(
    //   //     function (msg) {
    //   //       alert(msg); // do something useful instead of alerting
    //   //     }
    //   // )
    //   },(error) => {
        this.googlePlus.login({
          // 'webClientId': environment.google_android_client_id,
          // 'offline': true,
          // 'scopes':'profile email'
        }).then((ress) => {
          this.loading.dismiss();
          // alert('berhasil login');
            // alert('sukses2 => ' + JSON.stringify(ress));
            // this.googlePlus.logout();
            this.LoginSosmed(ress['email'],'GMAIL',ress['userId']);
          },(errors) => {
            this.loading.dismiss();
            // this.LoginSosmed('dedy9669@gmail.com','GMAIL');
            // alert('Failed2 => ' + JSON.stringify(errors));
          });
      // });
    }

  }
}
