import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController,ViewController } from 'ionic-angular';

// import { ProfilePage } from '../profile/profile';
// import { ProjectDetailsPage } from '../projectInfo/projectdetails';
import 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'search-agent-page',
  templateUrl: 'search-agent.html'
})
export class SearchAgentPage {
  agent:any[] = [];
  loading:any;
  user:any;
  url_api = environment.Url_API;
  cons = environment.cons_pb;
  constructor(
    public nav: NavController,
    private http: HttpClient,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public socialSharing: SocialSharing
    ,public view :ViewController
  ) {    
    this.loading = this.loadingCtrl.create();
  }


  ionViewDidLoad() {
    this.loading.present();
    this.loadItem();
     
  }
  dismiss(){
    this.view.dismiss();
  }
  loadItem(){
    this.http.get(this.url_api+"c_agent/get")
    .subscribe(
      (x:any) => {
        if(x.Error == true) {           
            alert(x.Pesan);            
        }
        else {
          x = x.Data;
          // console.log(x);
          var data = x;
          data.forEach(val => {
        
            this.agent.push({
              group_cd: val.group_cd,
              group_name: val.group_name                
            });
          });
          this.loading.dismiss();
        }
      }
    );
  }
  getItems(ev: any) {
    
    // set val to the value of the searchbar
    let val = ev.target.value;
    console.log(val);
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {      
      this.agent = this.agent.filter((item) => {
        return (item.group_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      
    }
    if(val.length==0){
      this.agent =[];
      this.loading.present();
      this.loadItem();
    }
  }
  GetAgent(ev:any):void{
    // console.log(ev);
    this.view.dismiss(ev);
  }
  // dismiss() {
  //   this.view.dismiss();
  // }
}
