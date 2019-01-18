import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, RequestMethod, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import * as jwt_decode from 'jwt-decode';

declare var CONFIG;

@Injectable()
export class ApiService {

  private baseUrl = CONFIG.apiUrl;

  constructor(private http: Http, 
              private auth: AuthService,
              private httpClient: HttpClient) { }

  getUserId() {
    if (this.auth.isLoggedIn()) {
      const jwtToken = this.auth.getToken();
      const decodedToken = jwt_decode(jwtToken);
      const userId = decodedToken.username;
      return  userId;
    }
  }

  get(url: string) {
    return this.request(url, RequestMethod.Get);
  }

  post(url: string, body: Object) {
    return this.request(url, RequestMethod.Post, body);
  }

  put(url: string, body: any) {
    return this.request(url, RequestMethod.Put, body);
  }

  delete(url: string) {
    return this.request(url, RequestMethod.Delete);
  }

  request(url: string, method: RequestMethod, body?: Object) {
    //console.log(this.httpClient);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Access-Control-Allow-Headers', 'Content-Type');
    headers.append('Authorization', `Bearer ${this.auth.getToken()}`);
    const requestOptions = new RequestOptions({
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers,
    });

    if (body) {
      requestOptions.body = body;
    }

    const request = new Request(requestOptions);
    return this.http.request(request)
      .pipe(
        map((res: Response) => 
          this.onRequest(res)
        ),  
        /*catchError((err, caught) => {
          return Observable.empty();
          //this.onRequestError(err)
        })*/
      );
  }

  onRequest(res: Response) {
    if(res.status == 200) {
      return res.json();
    }else {
      return res;
    }
  }

  onRequestError(res) {
    if(res.status == 401) {
      this.auth.logout();
    }
    return res;
  }

}
