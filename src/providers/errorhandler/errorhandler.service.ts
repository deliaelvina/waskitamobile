import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import { NativeStorage } from '@ionic-native/native-storage';
import { ErrorStatusModel } from "./errorhandler.model";


@Injectable()
export class ErrorhandlerService {
  constructor(
    public http: Http,
    public nativeStorage: NativeStorage
  ) {}

  getData(): Promise<any> {
// getData(): {
    return this.http.get('./assets/error_status/error.json')
     .toPromise()
     .then(response => response.json() )
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

 

}
