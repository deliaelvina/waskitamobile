import { Component } from "@angular/core";
import {
  NavController,
  LoadingController,
  AlertController,
  Platform
} from "ionic-angular";
import { Validators, FormGroup, FormControl } from "@angular/forms";

import { TabsNavigationPage } from "../tabs-navigation/tabs-navigation";
import { SignupPage } from "../signup/signup";
import { ResetPasswordPage } from "../reset-password/reset-password";
import { ForgotPasswordPage } from "../forgot-password/forgot-password";

import { FacebookLoginService } from "../facebook-login/facebook-login.service";
import { GoogleLoginService } from "../google-login/google-login.service";
import { TwitterLoginService } from "../twitter-login/twitter-login.service";
import { AuthService } from "../../auth/auth.service";
import { ToastController } from "ionic-angular";
//error handle
import { ErrorStatusModel } from "../../providers/errorhandler/errorhandler.model";
import { ErrorhandlerService } from "../../providers/errorhandler/errorhandler.service";
import { Facebook, FacebookLoginResponse } from "@ionic-native/facebook";
import { GooglePlus } from "@ionic-native/google-plus";
import { environment } from "../../environment/environment";
import { Agentregistpage } from "./agentregist";
import { SignupagntPage } from "./signupagnt";

@Component({
  selector: "regist-page",
  templateUrl: "registoptions.html"
})
export class RegisterrPage {
  login: FormGroup;
  main_page: { component: any };
  loading: any;
  devices: string;
  //error handle
  // ErrorList: ErrorStatusModel = new ErrorStatusModel();
  ErrorList: any;
  dataLog: any;
  agentstat: any;

  constructor(
    public nav: NavController,
    public facebookLoginService: FacebookLoginService,
    public googleLoginService: GoogleLoginService,
    public twitterLoginService: TwitterLoginService,
    public loadingCtrl: LoadingController,
    private _authService: AuthService,
    private toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private _errorService: ErrorhandlerService,
    private facebook: Facebook,
    public googlePlus: GooglePlus,
    public platform: Platform
  ) {
    platform.ready().then(source => {
      if (this.platform.is("android")) {
        localStorage.setItem("Device", "android");
        this.devices = "android";
        // alert("running on Android device!");
      }
      if (this.platform.is("ios")) {
        this.devices = "iOS";
        localStorage.setItem("Device", "iOS");
      }
      if (this.platform.is("mobileweb")) {
        this.devices = "web";
        localStorage.setItem("Device", "web");
      }
      // alert(source);
    });
    this.main_page = { component: TabsNavigationPage };
    this.loading = this.loadingCtrl.create();
    this.login = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      device: new FormControl(""),
      token: new FormControl("")
    });
  }

  ionViewDidLoad() {
    this._errorService.getData().then(data => {
      // console.log(data.Error_Status);

      this.ErrorList = data.Error_Status;
      // this.ErrorList.Code = data.Code;
      // this.ErrorList.Description = data.Description;
    });
  }

  showAlert(title: any, subTitle: any) {
    let warning = this.alertCtrl.create({
      cssClass: "alert",
      title: title,
      subTitle: subTitle,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.nav.pop();
          }
        }
      ]
    });

    warning.present();
  }

  agentRegist(grouptypes: any) {
    // console.log(grouptypes);
    this.nav.push(Agentregistpage, { grouptypes: grouptypes });
  }
}
