import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { environment } from "../environment/environment";
import "rxjs/add/operator/map";

@Injectable()
export class FormService{
    urlAPI = environment.Url_API; 
     
    constructor(private http:Http){
        console.log(this.urlAPI);
        console.log(environment.Url_API);
    }
    
    Form_Profil(value:any[]){
        console.log(value);
        return this.http.post(this.urlAPI+"c_profil/save",value);
    }

    Change_Password(value:any[]){
        console.log(value);
        // return this.http.post(this.urlAPI+"c_auth/Login",JSON.stringify({ email: email, password: password }))
        return this.http.post(this.urlAPI+"c_profil/changepass",value);
        // .map((response:Response)=>{
        //     const Res = response.json();
        //     if(Res){
        //         localStorage.setItem('UserId', JSON.stringify(Res));
        //         if(!Res.Error){
        //             localStorage.setItem('MenuDash', JSON.stringify(Res.Data.DashMenu));
        //             localStorage.setItem('Group', Res.Data.Group);
        //             localStorage.setItem('UserId', Res.Data.UserId);
        //             localStorage.setItem('Token', Res.Data.Token);
        //             localStorage.setItem('User', Res.Data.user);
        //             localStorage.setItem("isLogin","true");
        //         }
        //     }
        //     // console.log(Res);
        // });
    }
    Contact_Form(value:any[]){
        console.log(value);
        return this.http.post(this.urlAPI+"c_contact/kirim_contact",value);
    }
}
