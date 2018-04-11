import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { environment } from "../environment/environment";
import "rxjs/add/operator/map";

@Injectable()
export class AuthService{
    urlAPI = environment.Url_API; 
     
    constructor(private http:Http){
        console.log(this.urlAPI);
        console.log(environment.Url_API);
    }
    // Login(email:string,password:string){
    Login(value:any[]){
        // return this.http.post(this.urlAPI+"c_auth/Login",JSON.stringify({ email: email, password: password }))
        return this.http.post(this.urlAPI+"c_auth/Login",value)
        .map((response:Response)=>{
            const Res = response.json();
            if(Res){
                localStorage.setItem('currentUser', JSON.stringify(Res));
                if(!Res.Error){
                    localStorage.setItem('MenuDash', JSON.stringify(Res.Data.DashMenu));
                    localStorage.setItem('Group', Res.Data.Group);
                    localStorage.setItem('UserId', Res.Data.UserId);
                    localStorage.setItem('Name', Res.Data.name);
                    localStorage.setItem('Token', Res.Data.Token);
                    localStorage.setItem('User', Res.Data.user);
                    localStorage.setItem("isLogin","true");
                    localStorage.setItem("isReset",Res.Data.isResetPass);
                    localStorage.setItem("AgentCd",Res.Data.AgentCd);
                }
            }
            // console.log(Res);
        });
    }
    LoginSosmed(email:string,medsos:string,userId:string){
        return this.http.post(this.urlAPI+"c_auth/LoginWithSosmed",JSON.stringify({ Email: email, Medsos: medsos, LoginId : userId}))
        // return this.http.post(this.urlAPI+"c_auth/LoginGuest",value)
        .map(res=>res.json());
        // .map((response:Response)=>{
        //     const Res = response.json();
        //     if(Res){
        //         localStorage.setItem('currentUser', JSON.stringify(Res));
        //         if(!Res.Error){
        //             localStorage.setItem('MenuDash', JSON.stringify(Res.Data.DashMenu));
        //             localStorage.setItem('Group', Res.Data.Group);
        //             localStorage.setItem('UserId', Res.Data.UserId);
        //             localStorage.setItem('Token', Res.Data.Token);
        //             localStorage.setItem('User', Res.Data.user);
        //             localStorage.setItem("isLogin","true");
        //             localStorage.setItem("isReset",Res.Data.isResetPass);
        //         }
        //     }
        //     // console.log(Res);
        // });
    }
    ResetPassword(value:any[]){        
        return this.http.post(this.urlAPI+"c_auth/Resetpass",value).map((response:Response)=>{
            const Res = response.json();
            if(Res){
                localStorage.setItem('resetpass', JSON.stringify(Res));
            }
            // console.log(Res);
        });
    }
    ForgetPassword(value:any[]){        
        return this.http.post(this.urlAPI+"c_auth/ForgetPassword",value).map(res=>res.json());
    }
    SignUp(value:any[]){
        // return this.http.post(this.urlAPI+"c_auth/SignUp",value).map(res=>res.json());
        return this.http.post(this.urlAPI+"c_auth/SignUpGuest",value).map(res=>res.json());
    }
    cekSignUp(email:string,userId:string){        
        return this.http.post(this.urlAPI+"c_auth/CheckEmail",JSON.stringify({ Email: email,LoginId:userId})).map(res=>res.json());
    }
}
