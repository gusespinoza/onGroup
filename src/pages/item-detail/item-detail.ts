import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';

import { Items } from '../../providers/providers';


@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  

  item: any;
  actividad: any;
  icoPrivacidad: string;

  botonInfo: boolean = false;
  botonUnion: boolean = false;


  constructor(public navCtrl: NavController, navParams: NavParams, 
  	items: Items,
  	public toastCtrl: ToastController) {
    this.item = navParams.get('item') || items.defaultItem;

    this.actividad = navParams.get('actividad');
    this.icoPrivacidad = this.actividad.privacidad;

    switch(this.actividad.privacidad) { 

  	   case 'lock': {
  	      this.botonInfo = true;
  	      this.botonUnion = true;
  	      break; 
  	   }
	  }    

  }

  cerrarModal(){
  	this.navCtrl.pop();
  }

  unirse(){
  	console.log("[uniser] inicio union a la actividad");
  	let toast = this.toastCtrl.create({
            message: 'Solicitud enviada!',
            duration: 1000,
            position: 'middle'
          });

  	toast.onDidDismiss(() => {
        
        this.navCtrl.pop();
    });
    toast.present();
    
    
  }

  cierra(){
  	this.navCtrl.pop();
  }

  nocierra(){
  	return;
  }

}
