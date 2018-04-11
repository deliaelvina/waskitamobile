import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController } from 'ionic-angular';
import { Validators,FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { ToastController } from 'ionic-angular';
import { PasswordValidator } from '../../components/validators/password.validator';
import { AuthService } from '../../auth/auth.service';
//error handle
import { ErrorhandlerService } from '../../providers/errorhandler/errorhandler.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'reset-password-page',
  templateUrl: 'reset-password.html'
})
export class ResetPasswordPage {

  signup_form:FormGroup;
  signup: FormGroup;
  main_page: { component: any };
  loading: any;
  ErrorList:any;
  validation_messages = {
    'oldpass': [
      { type: 'required', message: 'Please input your old password.' }
    ], 
    'newpass': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'confpass': [
      { type: 'required', message: 'Confirm password is required' }
    ],
    'matching_passwords': [
      { type: 'areEqual', message: 'Password mismatch' }
    ]
  };
  constructor(
    public nav: NavController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private _authService: AuthService,
    private _errorService: ErrorhandlerService,
    public formBuilder: FormBuilder
  ) {
    this.main_page = { component: TabsNavigationPage };

   
  }
  
  ionViewWillLoad(){
    this.signup = new FormGroup({
      newpass: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      confpass: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    });

    this.signup_form = this.formBuilder.group({
      // oldpass: new FormControl('', Validators.required),
      // newpass: new FormControl('', Validators.required),
      // confpass: new FormControl('', Validators.required),
      email:localStorage.getItem('User'),
      matching_passwords:this.signup
    });
  
  }
  ionViewDidLoad() {
    this._errorService.getData()
    .then(data=>{
      this.ErrorList = data.Error_Status;
    });
  }

  doSignup(){
    // this.nav.setRoot(this.main_page.component);
    console.log(this.signup_form.value);
    this.loading = this.loadingCtrl.create();
    this._authService.ResetPassword(this.signup_form.value).subscribe(
      result=>{
        let x = JSON.parse(localStorage.getItem('resetpass'));

        this.loading.dismiss();
        if(x.Error){//error login

          // alert(currentUser.Pesan);
          let toast = this.toastCtrl.create({
            message: x.Pesan,
            duration: 3000,
            position: 'top'
          });

          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
          toast.present();
          localStorage.removeItem('resetpass');
        }else{

          localStorage.clear();
          this.nav.push(LoginPage);

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
          let toast = this.toastCtrl.create({
            message: errS,
            duration: 3000,
            position: 'top'
          });

          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
          toast.present();
      }
    );
  
  }
  // doReset(){
  //   console.log(this.signup.value);
  // }


}
