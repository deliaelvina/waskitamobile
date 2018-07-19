import { Injectable } from "@angular/core";
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { ReportModel } from './report.model';

@Injectable()
export class ReportService {
  constructor(public http: Http) {}

  getData(): Promise<ReportModel> {
    return this.http.get('./assets/example_data/listing.json')
     .toPromise()
     .then(response => response.json() as ReportModel)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); 
    return Promise.reject(error.message || error);
  }

}
