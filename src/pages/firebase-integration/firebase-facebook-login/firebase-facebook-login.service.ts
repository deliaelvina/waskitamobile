import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseFacebookUserModel } from './firebase-facebook-user.model';
import * as firebase from 'firebase/app';


@Injectable()
export class FirebaseFacebookLoginService {
  FB_APP_ID: number = 179906072637284;

  constructor(
    public http: Http,
    public nativeStorage: NativeStorage,
    public fb: Facebook,
    public afAuth: AngularFireAuth,
    public platform: Platform
  ){
    // this.fb.browserInit(this.FB_APP_ID, "v2.8");
    if(!platform.is('cordova')){
      this.fb.browserInit(this.FB_APP_ID, "v2.8");
    }
  }

  doFacebookLogin(){
    return new Promise<FirebaseFacebookUserModel>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        //["public_profile"] is the array of permissions, you can add more if you need
        this.fb.login(["public_profile"]).then((response) => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
          firebase.auth().signInWithCredential(facebookCredential);
          //Getting name and gender properties
          // this.fb.api("/me?fields=name,gender", [])
          this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', [])
          .then((user) => {
            this.setFacebookUser(user)
            .then((res) => {
              resolve(res);
            });
          });
        },(err) => {
          reject(err);
        });
      }
      else{
        this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          // this.fb.api("/me?fields=name,gender", [])
          this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', [])
          .then((user) => {
            this.setFacebookUser(user)
            .then((result) => {
              resolve(result);
            });
          })
        })
      }
    })
  }

  setFacebookUser(user: any)
  {
    return new Promise<FirebaseFacebookUserModel>((resolve, reject) => {
      this.getFriendsFakeData()
      .then(data => {
        resolve({
          userId: user.id,
          name: user.first_name,
          gender: user.gender,
          // image: "https://graph.facebook.com/" + user.id + "/picture?type=large",
          image: user.picture_large,
          friends: data.friends,
          photos: data.photos,
          email : user.email
        })
      });
    });
  }

  doFacebookLogout()
  {
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut()
        resolve();
      }
      else{
        reject();
      }
    });
  }

  getFacebookUser()
  {
    return new Promise<FirebaseFacebookUserModel>((resolve, reject) =>{
      if(firebase.auth().currentUser){
        //Getting name and gender properties
        this.fb.api("/me?fields=name,gender", [])
        .then((user) => {
          this.setFacebookUser(user)
          .then((res) => {
            resolve(res);
          });
        })
      }
      else{
        reject();
      }
    })
  }

  getFriendsFakeData(): Promise<any> {
    return this.http.get('./assets/example_data/social_integrations.json')
     .toPromise()
     .then(response => response.json())
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
