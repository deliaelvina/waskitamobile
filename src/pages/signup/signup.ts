import { Component,Input,ViewChild } from '@angular/core';
import { NavController, ModalController, LoadingController, ToastController,AlertController,Platform,NavParams } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';

import { FacebookLoginService } from '../facebook-login/facebook-login.service';
import { GoogleLoginService } from '../google-login/google-login.service';
import { TwitterLoginService } from '../twitter-login/twitter-login.service';
import { SearchAgentPage } from '../search-agent/search-agent';
import { AuthService } from '../../auth/auth.service';
import { LoginPage } from '../login/login';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { GooglePlus } from '@ionic-native/google-plus';
import { environment } from '../../environment/environment';

@Component({
  selector: 'signup-page',
  templateUrl: 'signupguest.html',
  // templateUrl: 'signup.html'
})
export class SignupPage {
  @ViewChild('input') myInput ;
  public AgentClick: boolean = false;

  signup: FormGroup;
  device:string;

  main_page: { component: any };
  loading: any;
  Agent:any[]=[];
  userData: any = {
    id:null,
    email:null,
    first_name:null,
    image:null,
    username:null,
    medsos:null
  };
  temail:string ;
  dMedsos:boolean = true;
  ErrorList:any;
  uC:any;

  validation_messages:any;
  constructor(
    public nav: NavController,
    public modal: ModalController,
    public facebookLoginService: FacebookLoginService,
    public googleLoginService: GoogleLoginService,
    public twitterLoginService: TwitterLoginService,
    public loadingCtrl: LoadingController
    ,private _authService: AuthService
    ,private facebook: Facebook
    ,private toastCtrl: ToastController
    ,private _errorService: ErrorhandlerService,
    public googlePlus: GooglePlus
    ,public alertCtrl: AlertController,
    public platform:Platform
    , public navParam : NavParams
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

    this.signup = new FormGroup({
      FullName:new FormControl('',Validators.required),
      Email: new FormControl('',Validators.required),
      Handphone: new FormControl('',Validators.compose([Validators.minLength(10),Validators.required])),
      Medsos: new FormControl(''),
      Id:new FormControl(''),
      password : new FormControl('',Validators.compose([Validators.minLength(5),Validators.required])),
      cpassword : new FormControl('')
    });
    var dt = this.navParam.get('dLog');
    var dtf = this.navParam.get('from');
    var uc = this.navParam.get('uCount');

    if(uc == true){
      this.uC = true;
      this.signup.get('password').setValue('guest');
      this.signup.get('cpassword').setValue('guest');
    } else {
      this.uC = false;
    }

    this.chekEmailSetData2(dt,dtf);

    this.validation_messages = {
      'Handphone':[
        { type: 'required', message: 'No Handphone must be filled' },
      ],
      'password': [
        { type: 'required', message: 'Password must be filled' },
      ],
    }
  }
  ionViewDidLoad() {
  //  alert(this.temail);
  this._errorService.getData()
  .then(data=>{
    this.ErrorList = data.Error_Status;
  });
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
  //akmal
  googleSignUp(){
    // alert('haha');
    this.loading = this.loadingCtrl.create();

    let env = this;
    //Check Is Login Or Not
    // this.googlePlus.trySilentLogin({}).then((res) => {
    //   //Is Login True
    //   // alert('Success => ' + JSON.stringify(res));
    //   //cek account
    //   this.chekEmailSetData(res,'GMAIL');
    // },(error) => {
      //Is Login False => Open Google Login
      // alert('Failed => ' + JSON.stringify(error));
      this.googlePlus.login({
        // 'webClientId': environment.google_web_client_id,
        // 'offline': true
      }).then((ress) => {
          //Login Google True
          // alert('Success2 => ' + JSON.stringify(ress));
          this.chekEmailSetData(ress,'GMAIL');
        },(errors) => {
          //Login Google False
          // alert('Failed2 => ' + JSON.stringify(errors));
        });
    // });
  }

  doSubmit(){
    var hp = this.signup.value.Handphone;
    var pass = this.signup.value.password;
    var cpass = this.signup.value.cpassword;



    if(pass !== cpass){
      // this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "Password doesn't match",
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      // console.log('doesnt match');
      toast.present();
      this.signup.get('password').setValue('');
      this.signup.get('cpassword').setValue('');
    } else {
      // console.log('match');
      this.doSignup();
    }

  }
  doSignup(){

    this.loading = this.loadingCtrl.create();
    this.signup.value.Id = this.userData.id;
    this.loading.present();
    // alert(this.signup.value.Id);
    //cek email sudah ada blm
    this._authService.cekSignUp(this.signup.value.Email,this.signup.value.Id)
        .subscribe(
          (data)=>{
            // alert(JSON.stringify(data));
              if(data.Error){
                this.loading.dismiss();
                this.showAlert("ERROR!",data.Pesan);
              }else{
                this._authService.SignUp(this.signup.value).subscribe(
                  (dataSignUp)=>{
                    if(!dataSignUp.Error){
                      //Berhasil simpan then login
                      this._authService.LoginSosmed(this.signup.value.Email,this.signup.value.Medsos,this.signup.value.Id,this.device)
                      .subscribe(

                        (Res)=>{
                          // alert("Login sosmed OK=>" +JSON.stringify(Res));
                          if(!Res.Error){
                            // alert("Login sosmed OK=>" +JSON.stringify(Res));
                            // alert(Res.Data.name);
                            this.loading.dismiss();
                            localStorage.setItem('MenuDash', JSON.stringify(Res.Data.DashMenu));
                                  localStorage.setItem('Group', Res.Data.Group);
                                  localStorage.setItem('UserId', Res.Data.UserId);
                                  localStorage.setItem('Token', Res.Data.Token);
                                  localStorage.setItem('User', Res.Data.user);
                                  localStorage.setItem('Name', Res.Data.name);
                                  localStorage.setItem("isLogin","true");
                                  localStorage.setItem("isReset",Res.Data.isResetPass);

                            var menu = JSON.parse(localStorage.getItem("MenuDash"))
                            // alert(menu.length);
                            if(menu.length>0){
                              this.nav.setRoot(this.main_page.component);
                            }else{
                              this.showAlert("ERROR!","You don't have menu");
                            }
                          }else{
                            this.showAlert("ERROR!",Res.Pesan);
                          }


                        },
                        (err)=>{
                          // alert("Login sosmed FAIL=>" +JSON.stringify(err));
                          this.loading.dismiss();
                          // console.log(err);
                          this.showAlert("ERROR!",err);
                        }
                      );
                    }else{
                      this.showAlert("ERROR!",data.Pesan);

                    }
                  },
                  (err)=>{
                    this.showAlert("ERROR! SignUp",err);
                  }
                );
              }
          },
          (err)=>{

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
          this.showAlert("ERROR! cek sigup",errS);
          }
        );



    // this.nav.setRoot(this.main_page.component);
  }

  chekEmailSetData2(profile:any,Fr:string){
    // var usId =Fr=='FB'?profile['id']:profile['userId'];
    // alert(usId);
    this.dMedsos = false;
    if(Fr=='FB'){
      this.userData = {
        id:profile['id'],
        email: profile['email'],
        first_name: profile['first_name'],
        image: profile['picture_large']['data']['url'],
        username: profile['name'],
        medsos:'FB'};
    }else{
      this.userData = {
        id:profile['userId'],
        email: profile['email'],
        first_name: profile['givenName'],
        image: profile['imageUrl'],
        username: profile['givenName'],
        medsos:'GMAIL'};
    }
  }

  chekEmailSetData(profile:any,Fr:string){
    var usId =Fr=='FB'?profile['id']:profile['userId'];
    // alert(usId+' cek email');
    if(Fr=='GMAIL'){
      this.googlePlus.logout();
    }else{
      this.facebook.logout();
    }
    this._authService.cekSignUp(profile['email'],usId)
    .subscribe(
      (data)=>{
        // alert(JSON.stringify(data));
        this.loading.dismiss();
          if(data.Error){
            this.showAlert("WARNING!",data.Pesan);
          }else{
            this.dMedsos = false;
            if(Fr=='FB'){
              this.userData = {
                id:profile['id'],
                email: profile['email'],
                first_name: profile['first_name'],
                image: profile['picture_large']['data']['url'],
                username: profile['name'],
                medsos:'FB'};
            }else{
              this.userData = {
                id:profile['userId'],
                email: profile['email'],
                first_name: profile['givenName'],
                image: profile['imageUrl'],
                username: profile['givenName'],
                medsos:'GMAIL'};
            }

          }
      },
      (err)=>{
        this.loading.dismiss();
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
      this.showAlert("ERROR!",errS);
        // let toast = this.toastCtrl.create({
        //   message: errS,
        //   duration: 3000,
        //   position: 'top'
        // });

        // toast.onDidDismiss(() => {
        //   console.log('Dismissed toast');
        // });
        // toast.present();
      }
    );
  }
  loginWithFB() {

    this.loading = this.loadingCtrl.create();
    this.facebook.login(['public_profile','email']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', [])
      .then(profile => {
        this.loading.dismiss();
        //cek account
        // alert(JSON.stringify(profile));
        this.chekEmailSetData(profile,'FB');
      });
    }).catch(err =>{
      // alert(JSON.stringify(err));
      // this.dMedsos = false;
      //       // if(Fr=='FB'){
      //         this.userData = {
      //           id:'1234',
      //           email: 'runrun@gmail.com',
      //           first_name: 'uchiha',
      //           image: '',
      //           username: '',
      //           medsos:'FB'};
      // alert(err);
      console.log(err);

    });
  }

  showTermsModal() {
    let modal = this.modal.create(TermsOfServicePage);
    modal.present();
  }


  showPrivacyModal() {
    let modal = this.modal.create(PrivacyPolicyPage);
    modal.present();
  }


}
