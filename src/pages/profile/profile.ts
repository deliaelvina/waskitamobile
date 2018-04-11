import { Component } from '@angular/core';
import { MenuController, SegmentButton, App, NavParams, LoadingController,Platform } from 'ionic-angular';
import { FollowersPage } from '../followers/followers';
import { SettingsPage } from '../settings/settings';
import { ProfileModel } from './profile.model';
import { ProfileService } from './profile.service';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { TermsOfServicePage } from '../terms-of-service/terms-of-service';
// import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import 'rxjs/Rx';
// import { ProjectPage } from '../projectInfo/project';
// import { ReservationProjectPage } from '../reservation/project';

//buat form

import { NavController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup , FormControl } from '@angular/forms';
import { UsernameValidator } from '../../components/validators/username.validator';
import { PasswordValidator } from '../../components/validators/password.validator';
import { PhoneValidator } from '../../components/validators/phone.validator';

import { Country } from './profile-mobile.model';
import 'rxjs/Rx';
import emailMask from 'text-mask-addons/dist/emailMask';
import {ChangePasswordPage} from '../profile-change-password/change-password';
import { environment } from '../../environment/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormService } from '../../auth/form.service';
import { ToastController } from 'ionic-angular';
import { ListingPage } from '../listing/listing';
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
// import {Md5} from 'ts-md5/dist/md5';
@Component({
  selector: 'profile-page',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  //buat api
  Genderss=[];
  profil:any[] = [];
  email:any;
  userid:any;
  url_api = environment.Url_API;
  cons = environment.cons_mobile;

  hd = new HttpHeaders({
    Token : localStorage.getItem("Token")
  });
  //buat form
  form_profil: FormGroup;
  // matching_passwords_group: FormGroup;
  // country_phone_group: FormGroup;
  ErrorList:any;
  GenderFemale: boolean =false;
  GenderMale: boolean =false;
  emailMask = emailMask;
  countries: Array<Country>;
  genders: Array<string>;
  display: string;
  profile: ProfileModel = new ProfileModel();
  loading: any;
  link: any[] = [];
  banner_title: string = "Welcome Haniyya Deska Akmal";
  main_page: { component: any };
  images = [
    this.url_api+'images/noimage.png'
  ];
  dt = {
    UserName : '',
    Name : '',
    Password : '',
    Gender : '',
    Handphone : '',
    Pict_profil:'',
    Header_profil: ''
  };
  

  constructor(
    public menu: MenuController,
    public app: App,
    public navParams: NavParams,
    public profileService: ProfileService,
    public loadingCtrl: LoadingController,
    public socialSharing: SocialSharing,
    private http: HttpClient,
    // private res: Response,
    //buat form
    public navCtrl: NavController
    // ,private _authService: AuthService
    // public formBuilder: FormBuilder
    ,private formservice: FormService
    ,private toastCtrl: ToastController
    ,public imagePicker: ImagePicker,
    public cropService: Crop,
    public platform: Platform
    ,private _errorService: ErrorhandlerService
    ,public alertCtrl: AlertController
  ) {
    this.main_page = { component: ListingPage };
    this.email = localStorage.getItem('User');
    this.userid = localStorage.getItem('UserId');
    this.display = "list";

    this.loading = this.loadingCtrl.create();
    // this.main_page = { component: TabsNavigationPage };
    // this.form_profil = new FormGroup({
    //   email: new FormControl('', Validators.required),
    //   password: new FormControl('test', Validators.required)
    // });
    this.form_profil = new FormGroup({
      UserName:new FormControl('',Validators.required),
      Name:new FormControl(''),
      Password:new FormControl(''),
      Gender:new FormControl(''),
      Handphone: new FormControl(''),
      Pict_profil: new FormControl(''),
      Header_profil: new FormControl('')
    });
  }
  
  changepass(){
    // alert('change');
    this.menu.close();
    this.app.getRootNav().push(ChangePasswordPage);
  }

  save(){
    // alert('save'); 
    var datas = this.form_profil.value;
    // var datas = this.dt.value;
    datas.Uid = localStorage.getItem('UserId');
    datas.wherename = localStorage.getItem('Name');
    if(this.dt.Gender != ''){
      datas.Gender = this.dt.Gender;
    }

    // console.log(datas);
    this.formservice.Form_Profil(datas).subscribe(
        (data:any)=>{
          data = data.json();
          // console.log(data);
            if(data.Error == true) {
              // alert(data.Pesan);
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
              // alert(data.Pesan);
              // let toast = this.toastCtrl.create({
              //   message: data.Pesan,
              //   duration: 3000,
              //   position: 'bottom'
              // });
            
              // toast.onDidDismiss(() => {
              //   console.log('Dismissed toast');
              // });
              // toast.present();
              // this.navCtrl.push(ListingPage);
              this.showAlert("Yeay!",data.Pesan,'profil');
              
                  // this.loading.dismiss();
            }  
          },
          (err)=>{
            let toast = this.toastCtrl.create({
              message: err,
              duration: 3000,
              position: 'top'
            });
    
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
            toast.present();
          }
    );
    // console.log(this.signup.value);
    //   this._authService.SignUp(this.signup.value).subscribe(
    //     (data)=>{
    //       if(!data.Error){
    //         alert(data.Pesan);
    //         this.nav.setRoot(LoginPage);
    //       }else{
    //         alert(data.Pesan);
    //       }
    //     },
    //     (err)=>alert(err)
    //   );
    // this.menu.close();
    // this.app.getRootNav().push(ChangePasswordPage);
  }
  Gender(t:any): void {
    //  alert(t);
    this.dt.Gender=t;
 }
 showAlert(title:any, subTitle:any, act:any) {
  var bah:any;
  if(act == 'menu'){
    bah = {text : 'Ok', handler : () => {
      this.navCtrl.setRoot(this.main_page.component);
    }};
  }
  else if(act == 'profil'){
    bah = {text : 'Ok', handler : () => {
      localStorage.setItem('Name',this.form_profil.value.Name);
      this.navCtrl.setRoot(this.main_page.component);
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
    // console.log(this.form_profil.value);
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
      this.profileService.getData()
      .then(data => {
        this.profile.user = data.user;
        // this.loading.dismiss();
      });
      this.loading.present();
      localStorage.removeItem('cons_project');
      // console.log(this.cons);
        this.http.get(this.url_api+"c_profil/getData/" + this.cons + "/" + this.email + "/" + this.userid, {headers:this.hd} )
        // this.http.get(this.url_api+"c_profil/getData/" + this.cons + "/" + this.email, {headers:this.hd} )
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
              // console.log(x);
              var data = x;
              this.dt.UserName=data[0].email;
              this.dt.Name= data[0].name;
              this.dt.Password= data[0].password;
              this.dt.Gender= data[0].gender;
              this.form_profil.get('Gender').setValue(data[0].gender);
              this.dt.Handphone= data[0].Handphone;
              
              // this.dt.Pict_profil= data[0].pict;
              this.dt.Pict_profil = data[0].pict?data[0].pict:'./assets/images/noimage.png';
              this.dt.Header_profil = data[0].pict_header?data[0].pict_header:'./assets/images/noimage.png';
              // this.dt.Header_profil=data[0].pict_header;
              console.log(data);
              this.loading.dismiss();
            }
          }
        );

        // this.genders = [
        //         "Male",
        //         "Female"
        //       ];
    }
    gantiprofil(){
      this.imagePicker.hasReadPermission().then(
        (result) => {
          if(result == false){
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();
          }
          else if(result == true){
            this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
              (results) => {
                for (var i = 0; i < results.length; i++) {
                  this.cropService.crop(results[i], {quality: 75}).then(
                    newImage => {
                      let image = newImage;
                      if (this.platform.is('ios')) {
                         image = image.replace(/^file:\/\//, '');
                      }
                      this.profileService.setUserImage(image);
                      this.profile.user.image = image;
                    },
                    error => console.error("Error cropping image", error)
                  );
                }
              }, (err) => console.log(err)
            );
          }
        }, (err) => {
          console.log(err);
        });
     }
     gantiheader(){
      this.imagePicker.hasReadPermission().then(
        (result) => {
          if(result == false){
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();
          }
          else if(result == true){
            this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
              (results) => {
                for (var i = 0; i < results.length; i++) {
                  this.cropService.crop(results[i], {quality: 75}).then(
                    newImage => {
                      let image = newImage;
                      if (this.platform.is('ios')) {
                         image = image.replace(/^file:\/\//, '');
                      }
                      this.profileService.setUserImage(image);
                      this.profile.user.image = image;
                    },
                    error => console.error("Error cropping image", error)
                  );
                }
              }, (err) => console.log(err)
            );
          }
        }, (err) => {
          console.log(err);
        });
     }
  // ionViewDidLoad() {
  //   this.loading.present();
  //   this.profileService.getData()
  //     .then(data => {
  //       this.profile.user = data.user;
  //       this.profile.following = data.following;
  //       this.profile.followers = data.followers;
  //       this.profile.posts = data.posts;
  //       this.loading.dismiss();
  //     });
  //     this.banner_title = localStorage.getItem("UserId");

  //     //buat form
  //     this.countries = [
  //       new Country('UY', 'Uruguay'),
  //       new Country('US', 'United States'),
  //       new Country('AR', 'Argentina')
  //     ];
  
  //     this.genders = [
  //       "Male",
  //       "Female"
  //     ];
  
  //     this.matching_passwords_group = new FormGroup({
  //       password: new FormControl('', Validators.compose([
  //         Validators.minLength(5),
  //         Validators.required,
  //         Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
  //       ])),
  //       confirm_password: new FormControl('', Validators.required)
  //     }, (formGroup: FormGroup) => {
  //       return PasswordValidator.areEqual(formGroup);
  //     });
  
  //     let country = new FormControl(this.countries[0], Validators.required);
  //     let phone = new FormControl('', Validators.compose([
  //       Validators.required,
  //       PhoneValidator.validCountryPhone(country)
  //     ]));
  //     this.country_phone_group = new FormGroup({
  //       country: country,
  //       phone: phone
  //     });
  
  //     this.form_profil = this.formBuilder.group({
  //       username: new FormControl('', Validators.compose([
  //         UsernameValidator.validUsername,
  //         Validators.maxLength(25),
  //         Validators.minLength(5),
  //         Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
  //         Validators.required
  //       ])),
  //       name: new FormControl('', Validators.required),
  //       lastname: new FormControl('', Validators.required),
  //       email: new FormControl('', Validators.compose([
  //         Validators.required,
  //         Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
  //       ])),
  //       gender: new FormControl(this.genders[0], Validators.required),
  //       country_phone: this.country_phone_group,
  //       matching_passwords: this.matching_passwords_group,
  //       terms: new FormControl(true, Validators.pattern('true'))
  //     });
  // }

  // //buat forms
  // validation_messages = {
  //   'username': [
  //     { type: 'required', message: 'Username is required.' },
  //     { type: 'minlength', message: 'Username must be at least 5 characters long.' },
  //     { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
  //     { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
  //     { type: 'validUsername', message: 'Your username has already been taken.' }
  //   ],
  //   'name': [
  //     { type: 'required', message: 'Name is required.' }
  //   ],
  //   'lastname': [
  //     { type: 'required', message: 'Last name is required.' }
  //   ],
  //   'email': [
  //     { type: 'required', message: 'Email is required.' },
  //     { type: 'pattern', message: 'Enter a valid email.' }
  //   ],
  //   'phone': [
  //     { type: 'required', message: 'Phone is required.' },
  //     { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
  //   ],
  //   'password': [
  //     { type: 'required', message: 'Password is required.' },
  //     { type: 'minlength', message: 'Password must be at least 5 characters long.' },
  //     { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
  //   ],
  //   'confirm_password': [
  //     { type: 'required', message: 'Confirm password is required' }
  //   ],
  //   'matching_passwords': [
  //     { type: 'areEqual', message: 'Password mismatch' }
  //   ],
  //   'terms': [
  //     { type: 'pattern', message: 'You must accept terms and conditions.' }
  //   ],
  // };

  onSubmit(values){
    console.log(values);
  }

  // goToFollowersList() {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   this.app.getRootNav().push(FollowersPage, {
  //     list: this.profile.followers
  //   });
  // }

  // goToFollowingList() {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   this.app.getRootNav().push(FollowersPage, {
  //     list: this.profile.following
  //   });
  // }

  // goToSettings() {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   this.app.getRootNav().push(SettingsPage);
  // }

  // onSegmentChanged(segmentButton: SegmentButton) {
  //   // console.log('Segment changed to', segmentButton.value);
  // }

  // onSegmentSelected(segmentButton: SegmentButton) {
  //   // console.log('Segment selected', segmentButton.value);
  // }

  // sharePost(post) {
  //  //this code is to use the social sharing plugin
  //  // message, subject, file, url
  //  this.socialSharing.share(post.description, post.title, post.image)
  //  .then(() => {
  //    console.log('Success!');
  //  })
  //  .catch(() => {
  //     console.log('Error');
  //  });
  // }

  

}
