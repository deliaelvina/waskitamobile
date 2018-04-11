import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { TabsNavigationPage } from '../tabs-navigation/tabs-navigation';
import { AuthService } from '../../auth/auth.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'forgot-password-page',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
  forgot_password: FormGroup;
  main_page: { component: any };

  constructor(public nav: NavController
    ,private _authService: AuthService
  ) {
    this.main_page = { component: TabsNavigationPage };

    this.forgot_password = new FormGroup({
      email: new FormControl('', Validators.required)
    });
  }

  recoverPassword(){
    // console.log(this.forgot_password.value);
    // this.nav.setRoot(this.main_page.component);
    // this._authService.ForgetPassword(this.forgot_password.value)
    // .map((response: Response)=>{
    //   const Res = response.json();
    //   // console.log(Res);
    //   alert(Res.Pesan);
    //   // if(Res.Error){

    //   // }else{
    //   //   alert(Res.Pesa)
    //   // }
    // });
    this._authService.ForgetPassword(this.forgot_password.value).subscribe(
      (data) => {
        console.log(data);
        if(!data.Error){
          alert(data.Pesan);
          this.nav.setRoot(LoginPage);
        }else{
          alert(data.Pesan);
        }
      },  //changed
               (err)=>console.log(err)//,
              //  ()=>console.log("Done")
    );
  }

}
