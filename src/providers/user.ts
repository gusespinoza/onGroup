import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { URL_SERVICIOS } from './config/url.services';

import { AlertController } from 'ionic-angular';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public http: Http, public api: Api) {
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let data  = new URLSearchParams();
    data.append("correo", accountInfo.email);
    data.append("contrasena", accountInfo.password);

    let url = URL_SERVICIOS + "login" ;

    console.log(url);
    console.log(accountInfo.email);
    console.log(accountInfo.password);

    console.log('antess servicio');

    let seq = this.http.post(url, data).share();

    return seq
      .map(res => res.json());
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let data  = new URLSearchParams();
    data.append("correo", accountInfo.email);
    data.append("contrasena", accountInfo.password);

    let url = URL_SERVICIOS + "login/registrar_usuario" ;

    console.log(url);
    console.log(accountInfo.email);
    console.log(accountInfo.password);


    let seq = this.http.post(url, data).share();

    return seq
      .map(res => res.json());
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
