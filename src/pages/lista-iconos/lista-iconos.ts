import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ListaIconosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lista-iconos',
  templateUrl: 'lista-iconos.html',
})
export class ListaIconosPage {

  listaIconos: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {

  	this.listaIconos = navParams.get('lista');

  }

  ionViewDidLoad() {
  }

    /**
   * navega a detalle de la actividad
   */
  salvaIcono(ico: any, i: any) {
    console.log("icono seleccionado " + ico.icono);

    this.viewCtrl.dismiss(ico);

  }

  urlIco(ico: string){
  	let url = "../assets/icon/mapa-icons/"
  	return url + ico + ".png";
  }

}
