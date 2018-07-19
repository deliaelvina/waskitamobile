import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Listing2Model } from './listing2.model';

@Injectable()
export class Listing2Service {
  constructor(public http: Http) {}

  getData(): Promise<Listing2Model> {
    return this.http.get('./assets/example_data/listing.json')
     .toPromise()
     .then(response => response.json() as Listing2Model)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }

}
