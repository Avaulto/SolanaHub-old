import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  headerObj = {
    "Content-Type": "application/json",
  };
  private formatErrors(error: any) {
    return throwError(error.error);
  }

  get(path: string, params: HttpParams = new HttpParams(), headers?: any): Observable<any> {
    console.log(headers)
    return this.http
      .get(`${path}`,headers)
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, formData: FormData): Observable<any> {
    return this.http
      .put(`${path}`, formData, {
        headers: new HttpHeaders({
          // 'enctype': 'multipart/form-data;',
          // 'Accept': 'plain/text'
        }),
      })
      .pipe(catchError(this.formatErrors));
  }
  post(path: string, body: Object = {}): Observable<any> {
    return this.http
      .post(`${path}`, JSON.stringify(body), {
        headers: new HttpHeaders(this.headerObj),
      })
      .pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http
      .delete(`${path}`)
      .pipe(catchError(this.formatErrors));
  }
}
