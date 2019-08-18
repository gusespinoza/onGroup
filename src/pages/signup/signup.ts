import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { MainPage } from '../../pages/pages';
import { User } from '../../providers/user';
import { Http } from '@angular/http';

import { TranslateService } from '@ngx-translate/core';
import { URL_SERVICIOS } from '../../providers/config/url.services';

import md5 from 'crypto-md5';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { nombre: string, nick: string; email: string, password: string } = {
    nombre: '',
    nick: '',
    email: '',
    password: ''
  };

  public profilePicture: any = "https://www.gravatar.com/avatar/"

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public http: Http) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {
    // Attempt to login in through our User service
    // this.user.signup(this.account).subscribe((resp) => {
    //   this.navCtrl.push(MainPage);
    // }, (err) => {
    //
    //   this.navCtrl.push(MainPage); // TODO: Remove this when you add your signup endpoint
    //
    //   // Unable to sign up
    //   let toast = this.toastCtrl.create({
    //     message: this.signupErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });

    if(this.account.email != '' && this.account.password != ''){

      console.log(this.account.email);
      console.log(this.account.password);

      this.user.signup(this.account)
          .subscribe(res => {
          if (!res.error) {
            let toast = this.toastCtrl.create({
              message: "Bienvenido a OnGroup!",
              duration: 1000,
              position: 'top'
            });
            toast.present();
            this.navCtrl.push(MainPage);
          } else {
            let toast = this.toastCtrl.create({
              message: res.mensaje,
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });
    }
    else{
      let toast = this.toastCtrl.create({
        message: "Datos incorrectos, reingresar por favor.",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  emailChanged(){
    console.log("mail: " + this.account.email.toLowerCase() )
    this.profilePicture = "https://www.gravatar.com/avatar/" + md5(this.account.email.toLowerCase(), 'hex');
  }
}
