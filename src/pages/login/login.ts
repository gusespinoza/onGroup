import { Component } from '@angular/core';
import { NavController, ToastController, Platform, LoadingController} from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { Http, URLSearchParams } from '@angular/http';

import { User } from '../../providers/user';

import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';

import { URL_SERVICIOS } from '../../providers/config/url.services';

declare var google;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'gus@mail.com',
    password: '123'
  };

  //geocode
  private geocoder: any;
  private city:any;
  private ub_actual:any;

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public http: Http,
    public geolocation: Geolocation,
    private plat: Platform,
    public loadingCtrl: LoadingController) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });

    
  }

  // Attempt to login in through our User service
  doLogin() {

    let loader = this.loadingCtrl.create({
      content: "Cargando, por favor espere...",
      duration: 3000
    });

    loader.present();

    this.user.login(this.account)
        .subscribe(res => {
        if (!res.error) {
          this.cargaDataLogin(res);
          this.navCtrl.push(MainPage);
        } else {
          let toast = this.toastCtrl.create({
            message: res.mensaje,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          return;
        }
    });

    this.navCtrl.push(MainPage);
  }

  cargaDataLogin(res:any){

  }
}
