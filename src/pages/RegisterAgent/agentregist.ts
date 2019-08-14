import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ToastController,
  App
} from "ionic-angular";

import "rxjs/Rx";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environment/environment";

//import { ReservationPhasePage } from './phase';
import { ErrorhandlerService } from "../../providers/errorhandler/errorhandler.service";
import { DomSanitizer } from "@angular/platform-browser";
//import { WalkthroughPage } from '../walkthrough/walkthrough';
import { MyApp } from "../../app/app.component";
import { AuthService } from "../../auth/auth.service";
import {
  Validators,
  FormGroup,
  FormControl,
  FormBuilder
} from "@angular/forms";
import { Platform } from "ionic-angular";
import { AgentregistCam } from "./camera/camera";
import { formControlBinding } from "../../../node_modules/@angular/forms/src/directives/reactive_directives/form_control_directive";
import {
  FileTransfer,
  FileTransferObject,
  FileUploadOptions
} from "../../../node_modules/@ionic-native/file-transfer";
//import { TicketEntry } from '../ticket/ticketEntry';

@Component({
  selector: "Agentregist-page",
  templateUrl: "agentregist.html"
})
export class Agentregistpage {
  SignUpForm: FormGroup;

  loading: any;
  user: any;
  device: any;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  cons_mobile = environment.cons_mobile;
  available: boolean = true;
  view: boolean = false;
  projectss: any;
  projs: any[] = [];
  ErrorList: any;
  validation_messages: any;
  validation: any;
  anArray: any[] = [];
  checkproj: boolean = false;
  // selectedd: any[] = [];
  selectedd: any[] = [];

  hd = new HttpHeaders({
    Token: localStorage.getItem("Token")
  });

  fName: string = "REGISTRATION".replace(/ /gi, "");
  dt = new Date().toLocaleDateString().replace(/\//gi, "");
  avPict: boolean = false;
  imgID: any = null;
  pict: any = {
    img: null,
    name: null,
    img64: null
  };
  atachment: any = {
    name: null,
    url: null
  };
  attachment: any[] = [];
  btnproj: any[] = [];
  pictPost: any;
  checkedItems: boolean[];

  grouptypes: any;
  usermail: any;
  fullname: any;
  noinduk: any;
  phoneno: any;
  userpass: any;
  confirmpass: any;
  attachnik: any;

  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private _app: App,
    private _authService: AuthService,
    private _errorService: ErrorhandlerService,
    private sanitizer: DomSanitizer,
    public platform: Platform,
    private fileTf: FileTransfer
  ) {
    this.user = localStorage.getItem("User");
    this.user = navParams.get("user");
    this.grouptypes = navParams.get("grouptypes");
    // this.data = navParams.get('data');
    // this.datas = this.navParams.get('datas');
    // this.act = this.navParams.get('act');
    this.loading = this.loadingCtrl.create();
    this.device = localStorage.getItem("Device");

    this._errorService.getData().then(data => {
      this.ErrorList = data.Error_Status;
    });
    // this.frontData = JSON.parse(localStorage.getItem('menus'));

    this.loading.present();

    this.SignUpForm = new FormGroup({
      cons: new FormControl(this.cons),
      user_email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      group_type: new FormControl(this.grouptypes),
      full_name: new FormControl(),
      nomor_induk: new FormControl(),
      phone_no: new FormControl(),
      attachnik: new FormControl(),
      pictName: new FormControl(""),
      pictUrl: new FormControl(""),
      all_projects: new FormControl()
    });

    this.validation_messages = {
      full_name: [{ type: "required", message: "Full Name is Required" }],
      phone_no: [{ type: "required", message: "No Handphone is Required" }],
      user_email: [{ type: "required", message: "Email is Required" }],
      nomor_induk: [{ type: "required", message: "NIK is Required" }],
      button_camera: [{ type: "required", message: "Please Choose Picture!" }]
    };

  }

  logoutAPi() {
    this.loading.present();
    let UserId = localStorage.getItem("UserId");
    this._authService.logout().subscribe(
      (x: any) => {
        console.log(x);
        if (x.Error == true) {
          this.showAlert("Warning!", x.Pesan);
          this.loading.dismiss();
        } else {
          this.loading.dismiss();
          localStorage.clear();
          if (this.device == "android") {
            navigator["app"].exitApp();
          } else {
            //ios and web
            this._app.getRootNav().setRoot(MyApp);
          }
        }
      },
      err => {
        this.loading.dismiss();
        //filter error array
        this.ErrorList = this.ErrorList.filter(function (er) {
          return er.Code == err.status;
        });

        var errS;
        if (this.ErrorList.length == 1) {
          errS = this.ErrorList[0].Description;
        } else {
          errS = err;
        }
        this.showAlert("Error!", errS);
      }
    );
  }

  ionViewDidLoad() {
    this.loadProjects();
    // this.loading.dismiss();
  }

  frmSubmit(data) {

    if (!this.SignUpForm.valid) {
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "Your Sign Up Data Is Not Valid.",
        duration: 1000,
        position: "top"
      });

      toast.onDidDismiss(() => {
        this.loading.dismiss();
        console.log("Dismissed toast");
      });
      toast.present();
    } else {
      if (this.avPict) {
        if (this.platform.is("ios")) {
          this.upload(this.pict.img64, this.pict.name).then(
            datas => {
              var x = JSON.parse(datas.response);
              if (x.Error == true) {
                if (x.Status == 401) {
                  // this.showAlert("Warning!", x.Pesan,'');
                  this.logoutAPi();
                  this.loading.dismiss();
                } else {
                  // alert(x.Pesan);
                  this.showAlert("Warning!", x.Pesan);
                  this.loading.dismiss();
                }
              } else {
                this.atachment.name = this.pict.name;
                this.atachment.url = x.Data;
                // this.TicketEntryForm.get('pictName').setValue(this.pict.name);
                // this.TicketEntryForm.get('pictUrl').setValue(x.Data);
                this.save(data, this.pict.name);
              }
            },
            err => { }
          );
        } else {
          this.upload(this.pict.img, this.pict.name).then(
            datas => {
              var x = JSON.parse(datas.response);
              if (x.Error == true) {
                if (x.Status == 401) {
                  // this.showAlert("Warning!", x.Pesan,'');
                  this.logoutAPi();
                  this.loading.dismiss();
                } else {
                  // alert(x.Pesan);
                  this.showAlert("Warning!", x.Pesan);
                  this.loading.dismiss();
                }
              } else {
                // this.pict.url = x.Data;
                this.atachment.name = this.pict.name;
                this.atachment.url = x.Data;
                // this.TicketEntryForm.get('pictName').setValue(this.pict.name);
                // this.TicketEntryForm.get('pictUrl').setValue(x.Data);
                // console.log(data);
                this.save(data, this.pict.name);
              }
            },
            err => { }
          );
        }
      } else {
        // this.pict.url = '';
        this.atachment.name = "";
        this.atachment.url = "";
        // this.TicketEntryForm.get('pictName').setValue('');
        // this.TicketEntryForm.get('pictUrl').setValue('');
        this.save(data, this.pict.name);
      }
    }

    // console.log(data);
  }

  save(data, nampepic) {
    var datas = {
      frmdata: data,
      filename: nampepic,
      group_type: this.grouptypes,
      projek: this.selectedd
      // projeck: this.projs
    };

    console.log(datas);

    this.http.post(this.url_api + "c_auth/signupagent/", datas).subscribe(
      (x: any) => {
        if (x.Error == true) {
          if (x.Status == 401) {
            this.logoutAPi();
            this.loading.dismiss();
          } else {
            this.showAlert("Failed!", x.Pesan);
            this.loading.dismiss();
          }
        } else {
          //success
          this.loading.dismiss();
          this.showAlert("Success!", x.Pesan);
        }
      },
      err => {
        this.loading.dismiss();
        //filter error array
        this.ErrorList = this.ErrorList.filter(function (er) {
          return er.Code == err.status;
        });

        var errS;
        //filter klo error'a tidak ada di array error
        if (this.ErrorList.length == 1) {
          errS = this.ErrorList[0].Description;
        } else {
          errS = err;
        }
        this.showAlert("Error!", errS);
      }
    );
  }

  openCamera(img: any) {
    this.nav.push(AgentregistCam, { image: img });
  }

  ionViewWillEnter() {
    let images = JSON.parse(localStorage.getItem("image"));
    var rand = Math.floor(Math.random() * 100);
    localStorage.removeItem("image");

    if (images) {
      this.avPict = true;
      this.imgID = images.imgHere;
      this.pict.img = images.imgHere;
      this.attachment.push({
        no: rand,
        src: images.imgHere,
        b64: images.base64img
      });
      if (this.platform.is("ios")) {
        this.pict.img64 = images.base64img;
      }
      this.pict.name = this.fName + "_" + this.dt + "_regist_" + rand + ".jpg";
      this.pictPost.imgID =
        this.url_api +
        "images/registration/" +
        this.fName +
        "_" +
        this.dt +
        "_regist_" +
        rand +
        ".jpg";
    }
  }

  upload(pict: any, name: any) {
    const transfer: FileTransferObject = this.fileTf.create();

    const option: FileUploadOptions = {
      fileKey: "photo",
      fileName: name,
      chunkedMode: false,
      httpMethod: "post",
      mimeType: "image/jpeg",
      headers: { Token: localStorage.getItem("Token") }
    };

    return transfer.upload(
      pict,
      this.url_api + "c_auth/attachnik/" + this.cons,
      option
    );
  }

  loadProjects() {
    this.http
      .post(this.url_api + "c_auth/getProjects/" + this.cons_mobile, {
        headers: this.hd
      })
      .subscribe(
        (x: any) => {
          if (x.Error == true) {
            if (x.Status == 401) {
              this.logoutAPi();
              this.loading.dismiss();
            } else {
              this.loading.dismiss();
            }
          } else {
            //success

            // var data = x.Data;
            // this.tikno = data;?
            // this.SignUpForm.get("all_projects").setValue(x.Data);
            this.projs = x.Data;
            // this.projectss = data;
            // console.log(x.Data);

            this.loading.dismiss();
          }
        },
        err => {
          this.loading.dismiss();
          //filter error array
          this.ErrorList = this.ErrorList.filter(function (er) {
            return er.Code == err.status;
          });

          var errS;
          //filter klo error'a tidak ada di array error
          if (this.ErrorList.length == 1) {
            errS = this.ErrorList[0].Description;
          } else {
            errS = err;
          }
          this.showAlert("Error!", errS);
        }
      );
  }

  // AddProject(from: any, img: any, idx: number) {
  //   if (from == "button") {
  //     if (this.btnproj.length < 6) {
  //       // this.nav.push(TicketEntryCam, { from: from, image: img });
  //     } else {
  //       this.showToast("Maximal Projects is 6");
  //     }
  //   } else {
  //     // this.edited = idx;
  //     // this.nav.push(TicketEntryCam, { from: from, image: img });
  //   }
  // }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "top"
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });
    toast.present();
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
            this.nav.popToRoot();
          }
        }
      ]
    });

    warning.present();
  }

  cekProject(data: any) {

    const searchh = this.selectedd.indexOf(data);
    if (searchh >= 0) {
      this.selectedd.splice(searchh, 1);
    } else {
      this.selectedd.push(data);
    }
    console.log(this.selectedd);
  }

}
