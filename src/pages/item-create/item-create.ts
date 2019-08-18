import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ViewController, NavParams, ModalController } from 'ionic-angular';

import { ListaIconosPage } from '../lista-iconos/lista-iconos';

import { Camera } from '@ionic-native/camera';
import * as moment from 'moment';


@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;
  public ub_actual: any;
  public fecha: any;
  public hora: any;
  public publica: string = "none";

  public maxlength: any = 15;

  public URL_ICO: string = "../assets/icon/mapa-icons/";
  public icoSelec: string = "../assets/icon/mapa-icons/futbol.png";
  public existeIcono: string = "none";

  public icoPrivacidad: string = "eye";


  form: FormGroup;

  public grupoIconos: any = {
    deporte: [{
      nombre: "Ajedrez",
      icono: "ajedrez"
    },
    {
      nombre: "Fútbol",
      icono: "futbol"
    },
    {
      nombre: "Basquetbol",
      icono: "basquetbol"
    },
    {
      nombre: "Tenis",
      icono: "tenis"
    },
    {
      nombre: "Boxeo",
      icono: "boxeo"
    },
    {
      nombre: "Handball",
      icono: "handbol"
    },
    {
      nombre: "Natación",
      icono: "nado"
    },
    {
      nombre: "Ciclismo",
      icono: "ciclismo"
    },
    {
      nombre: "Voleibol",
      icono: "voleibol"
    }],
    comida: [{
      nombre: "Hamburguesa",
      icono: "hamburguesa"
    },
    {
      nombre: "Pan",
      icono: "pan"
    }],
    animales: [{
      nombre: "Perro",
      icono: "perro"
    },{
      nombre: "Gato",
      icono: "gato"
    }]
  }


  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder,
    public camera: Camera,
    public navParams: NavParams,
    public modalCtrl: ModalController) {

    this.fecha = moment().format('YYYY-MM-DD');
    this.hora = moment().format('HH:mm');


    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['', Validators.required],
      dia: this.fecha,
      hora: this.hora,
      privacidad: ['', Validators.required],
      participantes: 0,
      tipo_actividad: ['', Validators.required]
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    //trae ub actual
    this.ub_actual = navParams.get('ub_actual');

  }

  ionViewDidLoad() {

  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('La cámara no está habilitada.');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { 
      return; 
    }
    this.viewCtrl.dismiss(this.form.value);
  }

  cerrarModal(){
    this.navCtrl.pop();
    return;
  }

  crearActividad(){
    console.log("guarda actividad");
  }

  async mostrarIconos(){
    console.log("[mostrarIconos] tipo: " + this.form.controls['tipo_actividad'].value);

    let tipo = this.form.controls['tipo_actividad'].value;

    var lista;

    switch(tipo) { 
       case 'animales': { 
          lista = this.grupoIconos.animales;
          console.log(this.grupoIconos.animales);
          break; 
       } 
       case 'comida': { 
          lista = this.grupoIconos.comida;
          console.log(this.grupoIconos.comida);
          break; 
       }
       case 'deporte': { 
          lista = this.grupoIconos.deporte;
          console.log(this.grupoIconos.deporte);
          break;  
       }
    } 

    let modalDetalle = this.modalCtrl.create(ListaIconosPage, {"lista": lista})

    modalDetalle.onDidDismiss(data=>{
      this.icoSelec = this.URL_ICO + data.icono + ".png";
      console.log("icono: " + this.icoSelec);
      this.existeIcono = "block";
    });
    modalDetalle.present();


  }

  muestraIcoPrivacidad(){
    console.log("muestra icono "  + this.form.controls['privacidad'].value);

   let privacidad = this.form.controls['privacidad'].value;

   switch(privacidad) { 
       case 'privada': { 
          this.icoPrivacidad = "lock";
          break; 
       } 
       case 'todos': { 
          this.icoPrivacidad = "eye";
          break; 
       }
       case 'necesarios': { 
          this.icoPrivacidad = "people";
          break;  
       }
       case 'necesarios_cs': { 
          this.icoPrivacidad = "mail";
          break;  
       }
    } 


  }

}
