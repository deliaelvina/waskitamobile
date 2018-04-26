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
import { WalkthroughPage } from '../walkthrough/walkthrough';

declare var cordova: any;

@Component({
  selector: 'reserve-page',
  templateUrl: 'reserve.html'
})
export class ReservationReservePage {
  reserveForm: FormGroup;

  countries: Array<Country>;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });

  main_page: { component: any };

  months:any[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  nats:any[] = [];
  NUP_Type:any[] = [];

  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons: any;

  selected_image:any;
  ErrorList:any;

  base64Image:string;
  pict:any;
  imgID:any = null;
  imgNPWP:any = null;
  imgTF:any = null;
  // photos:any[] = [];
  edit:any;
  data:any;
  validation_messages:any;
  natSelect:any;
  reserveTypeSelect:any;

  dataLot:any;
  agent:any;
  act:any;
  rowID:any;

  group:any;
  cd:any;

  amt:number = 0;

  error:any;
  view:boolean = false;
  nation:any;
  R_type:any;
  dates:any;
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
    this.act = this.navParams.get('act');
    this.rowID = this.navParams.get('id');
    this.group = localStorage.getItem('Group');

    this.imgID = null;
    this.imgNPWP = null;
    this.imgTF = null;

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

    if(this.group == 'Guest'){
      this.cd = this.group;
    }
    else {
      this.cd = localStorage.getItem('AgentCd');
    }

    if(this.act == 'edit'){
      this.cons = this.navParams.get('cons');
      this.data = this.navParams.get('datas');
      this.edit = true;
      console.log(this.data);
      this.loadData();
    }
    else if (this.act == 'view'){
      this.cons = this.navParams.get('cons');
      this.data = this.navParams.get('datas');
      this.view = true;
      this.loadData();
    }
    else {
      this.data = JSON.parse(localStorage.getItem('data'));
      this.cons = this.data.cons;

      this.agent = {
        'Agent_cd' : this.cd?this.cd:'',
        'Group_cd' : this.data.agentGroupCd?this.data.agentGroupCd:'',
        'Type_cd' : this.data.agentTypeCd?this.data.agentTypeCd:''
      };

      this.dataLot = {
        entity : this.data.entity,
        project : this.data.project,
        property : this.data.towerCd,
        level : this.data.level,
        lotNo : this.data.lot
      };

      this.loadNats('');
      this.loadNupType('');
    }

    this.pict = [
      {for:'id', img:'', name:''},
      {for:'npwp', img:'', name:''},
      {for:'tf', img:'', name:''},
    ];

    this.pictPost = {
      imgID : '',
      imgNPWP : '',
      imgTF : ''
    };

    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });

    this.reserveForm = new FormGroup({
      rowID : new FormControl(0),
      cons : new FormControl(this.cons),
      user : new FormControl(localStorage.getItem('UserId')),
      businessID : new FormControl(0),
      reserveBy: new FormControl(localStorage.getItem('Name')),
      fullName: new FormControl('', Validators.required),
      number : new FormControl('', Validators.compose([
        // Validators.maxLength(15),
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('^[0-9]+$')
      ])),
      // number: new FormControl('', Validators.compose([
      //   Validators.required,
      //   PhoneValidator.validCountryPhone(phone)
      // ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      idNo: new FormControl('', Validators.compose([
        // Validators.required,
        // Validators.minLength(16),
        // Validators.pattern('^[0-9]+$')
      ])),
      national : new FormControl(''),
      // national_cd : new FormControl(''),
      // national_descs : new FormControl(''),
      address: new FormControl(''),
      reserveType: new FormControl('',Validators.required),
      // reservePrefix: new FormControl(''),
      amount: new FormControl(''),
      // reserveExp: new FormControl(''),
      remarks: new FormControl(''),
      lot: new FormControl(this.dataLot),
      pict: new FormControl(this.pictPost),
      agent: new FormControl(this.agent),
      // terms: new FormControl(true, Validators.pattern('true'))
    });

    this.validation_messages = {
      'fullName': [
        { type: 'required', message: 'Full Name is required.' },
        { type: 'minLength', message: 'Username must be at least 5 characters long.' },
        // { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
        // { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
        // { type: 'validUsername', message: 'Your username has already been taken.' }
      ],
      'email': [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Enter a valid email.' },
      ],
      'number': [
        { type: 'required', message: 'Phone Number is required.' },
        { type: 'pattern', message: 'Enter a valid Phone Number.' },
        { type: 'minLength', message: 'Phone Number must be at least 10 numbers long.' },
      ],
      // 'idNo': [
      //   // { type: 'required', message: 'ID Number is required.' },
      //   { type: 'pattern', message: 'Enter a valid ID Number.' },
      //   { type: 'minLength', message: 'ID Number must be at least 16 numbers long.' },
      // ],
      'reserveType' : [
        { type: 'required', message: 'Reservation Type is required.' },
      ],
    };
  }

  logoutAPi(){
    let UserId = localStorage.getItem('UserId');

    this.http.get(this.url_api+"c_auth/Logout/" +UserId, {headers:this.hd} )
      .subscribe(
        (x:any) => {
          if(x.Error == true) {
            if(x.Status == 401){
              this.showAlert("Warning!", x.Pesan,'');
              this.loading.dismiss();
            }
            else {
              this.showAlert("Warning!", x.Pesan,'');
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
            this.showAlert("Error!", errS,'');
        }
      );
  }

  loadNats(parm:any) {
    this.http.get(this.url_api+"c_reservate/getNationality/" + this.cons , {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            // this.nats = [{
            //   nationality_cd: '', descs: ''
            // }];
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);
          var data = x.Data;

          data.forEach(element => {
            if(element.nationality_cd == parm){
              if(this.view){
                this.nation = element.descs;
              }
              else {
                this.reserveForm.get('national').setValue(element);
              }
            }
          });

          this.nats = data;
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
          // let toast = this.toastCtrl.create({
          //   message: errS,
          //   duration: 3000,
          //   position: 'top'
          // });

          // toast.onDidDismiss(() => {
          //   console.log('Dismissed toast');
          // });
          // toast.present();
          this.showAlert("Error!", errS,'');
      }
    );
  }

  loadNupType(parm:any) {
    this.http.get(this.url_api+"c_reservate/getNupType/" + this.cons + "/" + this.data.entity + "/" + this.data.project , {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            this.NUP_Type = [{
              nup_type : '', descs : '', prefix : '', nup_amt : '', expired_minute : ''
            }];
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);
          var data = x.Data;

          data.forEach(element => {
            if(element.nup_type == parm){
              if(this.view){
                this.R_type = data.nup_type;
              }
              else {
                this.reserveForm.get('reserveType').setValue(element);
              }
            }
          });

          this.NUP_Type = data;
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
          // let toast = this.toastCtrl.create({
          //   message: errS,
          //   duration: 3000,
          //   position: 'top'
          // });

          // toast.onDidDismiss(() => {
          //   console.log('Dismissed toast');
          // });
          // toast.present();
          this.showAlert("Error!", errS,'');
      }
    );
  }

  ionViewDidLoad() {
    // alert("hee");
    this.loading.present();
    // console.log(this.data);
    // console.log(this.reserveForm.value.mobile);
    // this.loading.dismiss();
  }

  ionViewWillEnter(){
    // console.log('enter');
    let images = JSON.parse(localStorage.getItem('image'));
    var rand = Math.floor(Math.random() * 100);

    if(images){
      this.avPict = true;
      let z = images.for;
      if(z == 'id'){
        this.imgID = images.imgHere;
        this.pict[0].img = images.imgHere;
        this.pict[0].name = 'reservation_ID_'+rand+'.jpg';
        this.pictPost.imgID = this.url_api+'images/reservation/reservation_ID_'+rand+'.jpg';
        // this.pict[0].img64 = images.base64img;
      }
      else if(z == 'npwp'){
        this.imgNPWP = images.imgHere;
        this.pict[1].img = images.imgHere;
        this.pict[1].name = 'reservation_NPWP_'+rand+'.jpg';
        this.pictPost.imgNPWP = this.url_api+'images/reservation/reservation_NPWP_'+rand+'.jpg';
        // this.pict[1].img64 = images.base64img;
      }
      else if(z == 'tf'){
        this.imgTF = images.imgHere;
        this.pict[2].img = images.imgHere;
        this.pict[2].name = 'reservation_TF_'+rand+'.jpg';
        this.pictPost.imgTF = this.url_api+'images/reservation/reservation_TF_'+rand+'.jpg';
        // this.pict[2].img64 = images.base64img;
      }
      // console.log(this.images);
    }
  }

  addZero(i:any){
    if(i < 10){
      i = '0'+i;
    }

    return i;
  }

  loadData(){
    this.http.get(this.url_api+"c_reservate/myReservation/" + this.cons + "/" + localStorage.getItem('Name') + "/" + this.rowID, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);
          var data = x.Data[0];
          console.log(data);
          // this.data = [];
          // this.data.push({
          //   projectName : data.ProjectName,
          //   towerName : data.Property,
          //   level_descs : data.Level,
          //   lot : data.LotNo,
          // });
          // this.data.projectName = data.ProjectName;
          // this.data.towerName = data.Property;
          // this.data.level_descs = data.Level;
          // this.data.lot = data.LotNo;

          var d = new Date(data.expired_time);
          this.dates = 'Expired Time : '+d.getDate().toString()+' '+this.months[d.getMonth().toString()]+' '+d.getFullYear().toString()+' '+this.addZero(d.getHours())+':'+this.addZero(d.getMinutes());
          this.reserveForm.get('rowID').setValue(this.rowID);
          this.reserveForm.get('businessID').setValue(data.business_id);
          this.reserveForm.get('reserveBy').setValue(data.reserve_by);
          this.reserveForm.get('fullName').setValue(data.Name);
          this.reserveForm.get('number').setValue(data.Phone);
          this.reserveForm.get('email').setValue(data.email_addr);
          this.reserveForm.get('idNo').setValue(data.ic_no);
          this.reserveForm.get('address').setValue(data.address1);
          this.reserveForm.get('remarks').setValue(data.remark);
          this.imgID = data.link_ktp?data.link_ktp:'';
          this.imgNPWP = data.link_npwp?data.link_npwp:'';
          this.imgTF = data.link_bukti_transfer?data.link_bukti_transfer:'';
          this.pictPost.imgID = data.link_ktp?data.link_ktp:'';
          this.pictPost.imgNPWP = data.link_npwp?data.link_npwp:'';
          this.pictPost.imgTF = data.link_bukti_transfer?data.link_bukti_transfer:'';
          this.amt = data.amount;
          this.data.payment_desc = data.payment_desc;
          this.data.price = data.price;
          this.loadNats(data.nationality);
          this.loadNupType(data.nup_type);
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
          // let toast = this.toastCtrl.create({
          //   message: errS,
          //   duration: 3000,
          //   position: 'top'
          // });

          // toast.onDidDismiss(() => {
          //   console.log('Dismissed toast');
          // });
          // toast.present();
          this.showAlert("Error!", errS,'');
      }
    );
  }

  openCamera(what:any,img:any){
    // let ask = this.alertCtrl.create({
    //   cssClass: 'alert',
    //   title : "Choose Photo From",
    //   buttons : [
    //     {text : 'Camera', handler: () => {
    //       // this.nav.pop();
    //       this.takeFoto(what);
    //     }},
    //     {text : 'Gallery', handler: () => {
    //       // this.nav.pop();
    //       this.takeGallery(what);
    //     }},
    //   ]
    // });

    // ask.present();
    this.nav.push(CameraPage,{from:what, image:img});
  }

  cekUnitStatus(frmData:any){
    var x = {
      entity:this.data.entity,
      project:this.data.project,
      towerCd:this.data.towerCd,
      level:this.data.level,
      lot: this.data.lot
    };

    this.http.post(this.url_api+"c_reservate/cekUnit/" + this.cons, x, {headers:this.hd} )
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
            this.logoutAPi();
            this.loading.dismiss();
          }
          else {
            // alert(x.Pesan);
            // this.available = false;
            this.showAlert("Warning!", "No Info Available",'');
            // alert(1);
            this.loading.dismiss();
          }
        }
        else {
          // console.log(x);

          var datas = x.Data[0];

          // console.log(datas);
          if(datas.status == 'A'){
            // this.nav.push(ReservationReservePage);
            this.save(frmData);
          }
          else {
            // let zz:any = this.nav.setRoot(ListingPage);
            this.loading.dismiss();
            this.showAlert("Warning!", "This Lot is Already Reserved", 'menu');
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
          this.showAlert("Error!", errS,'');
      }
    );
  }

  cekLength(fc:any, len:number){
    var valid:boolean = false;
    // console.log(fc);
    var x = fc.length;

    if(x < len){
      valid = false;
    }
    else {
      valid = true;
    }

    // this.reserveForm.get('number').setErrors(MinLengthValidator,valid);
    return valid;
  }

  onSubmit(data:any) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    // this.error = {
    //   fullNameError : this.reserveForm.get('fullName').hasError('required'),
    //   emailError : this.reserveForm.get('email').hasError('pattern'),
    //   numberMinError : this.reserveForm.get('number').hasError('minLength'),
    //   numberPatternError : this.reserveForm.get('number').hasError('pattern'),
    //   idMinError : this.reserveForm.get('idNo').hasError('minLength'),
    //   idPatternError : this.reserveForm.get('idNo').hasError('pattern'),
    // };
    // this.loading.dismiss();
    // console.log(data);

    var number = data.number;
    var idN = data.idNo;
    var idLen = idN.length;
    var numbLen = number.length;
    var types = this.reserveForm.get('reserveType').hasError('required');
    // console.log(number);
    // console.log(idN);
    // console.log(idLen);
    // console.log(numbLen);

    // return;
    if(numbLen < 10){
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "Phone Number must be at least 10 numbers long.",
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
    }
    // else if(idLen < 16){
    //   this.loading.dismiss();
    //   let toast = this.toastCtrl.create({
    //     message: "ID Number must be 16 numbers long.",
    //     duration: 3000,
    //     position: 'top'
    //   });

    //   toast.onDidDismiss(() => {
    //     console.log('Dismissed toast');
    //   });
    //   toast.present();
    // }
    else if(types){
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "Reservation Type is Required",
        duration: 3000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
    }
    else {
      if(data.national == ''){
        data.national = {
          nationality_cd:"",
          descs:"",
        };
      }
      if(data.reserveType == ''){
        data.reserveType = {
          nup_type:"",
          descs:"",
          prefix:"",
          nup_amt:0,
          expired_minute:"",
          amount:"",
        };
      }
      // this.loading.dismiss();
      // return;

      if(this.act == 'edit'){
        this.save(data);
      }
      else {
        this.cekUnitStatus(data);
      }
    }
  }

  save(data:any){
    // let fullNameError = this.reserveForm.get('fullName').hasError('required');
    // let emailError = this.reserveForm.get('email').hasError('pattern');
    // let data = this.reserveForm.value();
    if(!this.reserveForm.valid){
      this.loading.dismiss();
      let toast = this.toastCtrl.create({
        message: "Your Reservation Data Is Not Valid.",
        duration: 1000,
        position: 'top'
      });

      toast.onDidDismiss(() => {
        this.loading.dismiss();
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
                  // this.showAlert("Warning!", x.Pesan,'');
                  this.logoutAPi();
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
                // if(img.for == 'id'){
                //   // alert('id => '+JSON.stringify(x));
                //   this.pictPost.imgID = x.Data;
                // }
                // else if(img.for == 'npwp'){
                //   // alert('npwp => '+JSON.stringify(x));
                //   this.pictPost.imgNPWP = x.Data;
                // }
                // else if(img.for == 'tf'){
                //   // alert('tf => '+JSON.stringify(x));
                //   this.pictPost.imgTF = x.Data;
                // }

              }
              }, (err) => {
                // this.loading.dismiss();
                // this.showAlert('Failed!', JSON.stringify(err),'');
                // alert('e => '+JSON.stringify(err));
                // this.showAlert('Warning!', 'Upload '+img.for.toUpperCase()+' Failed','');
                // return true;
              }
            )
          // }
          // cnt += 1;
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

      return transfer.upload(pict, this.url_api+'c_reservate/upload/', option);
      // .then((x) => {
      //   console.log(x);
      //   // this.actSave();
      // },(err) => {
      //   this.loading.dismiss();
      //   // this.showAlert("Error!", 'Upload Image Failed','');
      //   console.log(err);
      // });
  }

  actSave(data:any){
    this.http.post(this.url_api+"c_reservate/saveNup/" , data, {headers:this.hd})
    .subscribe(
      (x:any) => {
        if(x.Error == true) {
          if(x.Status == 401){
            // this.showAlert("Warning!", x.Pesan,'');
            this.logoutAPi();
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
          this.loading.dismiss();
          this.showAlert("Success!", x.Pesan, 'menu');
          localStorage.removeItem('image');
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
          this.showAlert("Error!", errS,'');
      }
    );
  }

  showAlert(title:any, subTitle:any, act:any) {
    var bah:any;
    if(act == 'menu'){
      bah = {text : 'Ok', handler : () => {
        this.nav.setRoot(this.main_page.component);
        localStorage.removeItem('data');
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

  optionSelected(){
    var x = this.reserveForm.get('reserveType').value;
    // console.log(x);
    this.amt = x.amount;
  }

}
