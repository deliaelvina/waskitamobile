import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NavController, NavParams, LoadingController, Platform, ToastController, AlertController } from 'ionic-angular';
import { UsernameValidator } from '../../../components/validators/username.validator';
import { PhoneValidator } from '../../../components/validators/phone.validator';
import 'rxjs/Rx';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environment/environment';
// import { ErrorhandlerService } from '../../../providers/errorhandler/errorhandler.service';
// import { FormService } from '../../../auth/form.service';
import { ListingPage } from '../../listing/listing';
import { TabsNavigationPage } from '../../tabs-navigation/tabs-navigation';
import { FormService } from '../../../auth/form.service';
import { ErrorhandlerService } from '../../../providers/errorhandler/errorhandler.service';
@Component({
    selector: 'contact-page',
    templateUrl: 'contact.html'
  })
  export class ContactPage {
    contactForm: FormGroup;
    // contacs={
    //     Project: '',
    //     UserName : '',
    //     Name : '',
    //     Handphone : '',
    //     Desc:''
    // };
    ErrorList:any;
    descrip:any;
    parm:any;
    loading:any;
    user:any;
    url_api = environment.Url_API;
    cons = environment.cons_mobile;
    email:any;
    userid:any;
    main_page: { component: any };
    hd = new HttpHeaders({
        Token : localStorage.getItem("Token")
      });
    constructor(
      public nav: NavController,
      public alertCtrl: AlertController,
      // private http: HttpClient,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public formBuilder: FormBuilder,
      private http: HttpClient,
      private formservice: FormService,
      public platform: Platform,
      private toastCtrl: ToastController,
      private _errorService: ErrorhandlerService

    //   private _errorService: ErrorhandlrerService,
    ) {
      this.main_page = { component: ListingPage };
        this.email = localStorage.getItem('User');
    this.userid = localStorage.getItem('UserId');
      this.loading = this.loadingCtrl.create();
      this.parm=this.navParams.get('data');
      console.log(this.parm);
        // this.contacs.Project=this.parm.projectName;
      this.loading.present();


      this.contactForm = new FormGroup({
        Entity: new FormControl(''),
        Project_no: new FormControl(''),
        Project: new FormControl(''),
        Email:new FormControl('',Validators.required),
        Name:new FormControl('',Validators.required),
        Handphone: new FormControl('',Validators.required),
        Desc: new FormControl('',Validators.required)

      });
      // this.contactForm.get('Desc').setValue('Saya tertarik dengan (NamaProject) ini. Hubungi Saya untuk info detail.');
    }

    validation_messages = {
      'Desc':[
        {type: 'required', message: 'Description is required.'}
      ]
      // 'username': [
      //   { type: 'required', message: 'Username is required.' },
      //   { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      //   { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      //   { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      //   { type: 'validUsername', message: 'Your username has already been taken.' }
      // ],
      // 'name': [
      //   { type: 'required', message: 'Name is required.' }
      // ],
      // 'lastname': [
      //   { type: 'required', message: 'Last name is required.' }
      // ],
      // 'email': [
      //   { type: 'required', message: 'Email is required.' },
      //   { type: 'pattern', message: 'Enter a valid email.' }
      // ],
      // 'phone': [
      //   { type: 'required', message: 'Phone is required.' },
      //   { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
      // ],
      // 'password': [
      //   { type: 'required', message: 'Password is required.' },
      //   { type: 'minlength', message: 'Password must be at least 5 characters long.' },
      //   { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
      // ],
      // 'confirm_password': [
      //   { type: 'required', message: 'Confirm password is required' }
      // ],
      // 'matching_passwords': [
      //   { type: 'areEqual', message: 'Password mismatch' }
      // ],
      // 'terms': [
      //   { type: 'pattern', message: 'You must accept terms and conditions.' }
      // ],
    };
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

    ionViewDidLoad() {
      this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
        this.contactForm.get('Project').setValue(this.parm.projectName);
        this.contactForm.get('Entity').setValue(this.parm.entity);
        this.contactForm.get('Project_no').setValue(this.parm.projectNo);
        // this.contactForm.get('Entity').setValue(this.parm.Entity);
        // this.contactForm.get('Project_no').setValue(this.parm.Project_no);
        this.descrip = 'Saya tertarik dengan '+this.parm.projectName+' ini. Hubungi Saya untuk info detail.';
        // this.contactForm.get('Desc').setValue('Saya tertarik dengan '+this.parm.projectName+' ini. Hubungi Saya untuk info detail.');
        // console.log(this.parm.entity_cd);
        // console.log(this.parm.project_no);
        // this.contactForm.get('Entity').setValue(this.parm.projectName);
        // this.loading.dismiss();

        this.loading.present();
      // localStorage.removeItem('cons_project');
      // console.log(this.cons);
        this.http.get(this.url_api+"c_contact/getData/" + this.cons + "/" + this.email + "/" + this.userid, {headers:this.hd} )
        .subscribe(
          (x:any) => {
            if(x.Error == true) {
              if(x.Status == 401){
                // alert('401:'+x.Pesan);
                this.showAlert("Warning!", x.Pesan,'');
                this.loading.dismiss();
              }
              else {
                this.showAlert("Warning!", x.Pesan,'');
                this.loading.dismiss();
              }
            }
            else {
              x = x.Data;
            //   console.log(x);
              var data = x;

              this.contactForm.get('Email').setValue(data[0].email);
              this.contactForm.get('Name').setValue(data[0].name);
              this.contactForm.get('Handphone').setValue(data[0].Handphone);
              // this.contactForm.get('Desc').setValue(data[0].description);
              console.log(data);
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
              // this.nav.pop();
          }
        );
    }

    kirim(){
        // let toast = this.toastCtrl.create({
        //     message: 'Email Delivered',
        //     duration: 3000,
        //     position: 'bottom'
        //     });

        // toast.onDidDismiss(() => {
        // console.log('Dismissed toast');
        // });
        // toast.present();
        // // this.nav.push(ListingPage);
        // this.nav.setRoot(this.main_page.component);

        // alert('save');
        var datas = this.contactForm.value;
        datas.Desc= this.descrip;
        datas.cons = localStorage.getItem('cons_project');
        datas.Uid = localStorage.getItem('UserId');
        console.log(datas);
        this.formservice.Contact_Form(datas).subscribe(
            (data:any)=>{
              data = data.json();
              console.log(data);
                if(data.Error == true) {

                  // let toast = this.toastCtrl.create({
                  //   message: data.Pesan,
                  //   duration: 3000,
                  //   position: 'bottom'
                  // });

                  // toast.onDidDismiss(() => {
                  //   console.log('Dismissed toast');
                  // });
                  // toast.present();
                  this.showAlert("Warning!",data.Pesan,'');
                  this.loading.dismiss();
                }else{

                  // let toast = this.toastCtrl.create({
                  //   message: data.Pesan,
                  //   duration: 3000,
                  //   position: 'bottom'
                  // });

                  // toast.onDidDismiss(() => {
                  //   console.log('Dismissed toast');
                  // });
                  // toast.present();
                  this.showAlert("Information!",data.Pesan,'menu');

                  // this.nav.setRoot(this.main_page.component);
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
                  // this.nav.pop();
              }
              // err=>{
              //   console.log(err);
              // }
        );

      }



    onSubmit(data: any) {
      console.log(data);
    }

  }