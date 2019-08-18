import { Component } from '@angular/core';
import { NavController, 
        NavParams, 
        Platform, 
        ToastController, 
        LoadingController, 
        ModalController } from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { ItemCreatePage } from '../item-create/item-create';

import { Actividades } from '../../providers/actividades';
import { Geolocation } from '@ionic-native/geolocation';

import {Modal} from "ionic-angular/index";
import * as moment from 'moment';

declare var google;

// maker interface.
interface marker {
  id:number,
  nombre: string,
  icon: string,
  detalle: string,
  privacidad: string,
  region: string,
  fecha_hora: string
  lat: number;
  lng: number;
  dias_restantes: string;
}


@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  currentItems: any = [];
  public actividades: any = [];
  

  public mapa:boolean = false;

  public displaySearch:string="none";
  public displayMap:string="block";
  public searchTerm: string = '';
  tiempoRestante: any;

  //geocoder
  public geocoder: any;
  ubicacion_actual: { lat: number, lng: number} = {
    lat: 51.673858,
    lng: 7.815982
  };

  public markers: marker[] = [];
  private arrActivAux: marker[] = [];

  public zoom: number = 15;
  public map: any;

  lat: number = 51.678418;
  lng: number = 7.809007;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private plat: Platform, public toastCtrl: ToastController,
    public actProv: Actividades,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController) {

    this.plat.ready().then( ()=> {
      this.geolocation.getCurrentPosition().then( resp=>{

        this.ubicacion_actual.lat = resp.coords.latitude;
        this.ubicacion_actual.lng = resp.coords.longitude;

      });

      this.getListaActividades();
      this.setFilteredItems();

    });
    
  }

  //obtiene observabes asincronos para poder cargar listas de actividades
  async getListaActividades(){

      return await this.actProv.cargar_todos_mapa()
        .subscribe((res) => {

          this.actividades = res.actividades;

          for (let i = 0; i < this.actividades.length; i++) {

            switch(this.actividades[i].privacidad) { 
               case 'todos': { 
                  this.actividades[i].privacidad = 'eye';
                  break; 
               } 
               case 'privada': { 
                  this.actividades[i].privacidad = 'lock';
                  break; 
               }
               case 'necesarios': { 
                  this.actividades[i].privacidad = "people";
                  break;  
               }
               case 'necesarios_cs': { 
                  this.actividades[i].privacidad = "mail";
                  break;  
               }
            } 

            let fecha = moment(this.actividades[i].fecha_hora);
            fecha.locale('es');

            let dias_restantes = moment(fecha).fromNow();

            let marker: marker = {
              id: this.actividades[i].id_actividad,
              nombre: this.actividades[i].nombre,
              icon: "../assets/icon/mapa-icons/"+ this.actividades[i].tipo_act +".png",
              detalle: this.actividades[i].detalle,
              privacidad: this.actividades[i].privacidad,
              lat: this.actividades[i].ub_lat,
              lng: this.actividades[i].ub_lng,
              region: this.actividades[i].ub_region,
              fecha_hora: this.actividades[i].fecha_hora,
              dias_restantes: dias_restantes
            }

            this.markers.push(marker);
            this.arrActivAux.push(marker);
          }
          
        });

  }

  // muestra ventana loading
  ngAfterViewInit() {

    let loader = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: "Descubriendo nuevas actividades...",
      duration: 1000
    });

    loader.present();
  }

  //obtiene lat lng con un click
  obtienePosicion($event){
    console.log($event);
  }


  /**
   * Perform a service for the proper items.
   */
  getItems($event) {
    let val = $event.target.value;

    if (!val || !val.trim()) {
      return [];
    }
    return this.markers.filter((marker) => {
        var i =  marker.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1;
    });
  }


  /**
   * navega a detalle de la actividad
   */
  detalleActividad(actividad: any, i: any) {

    this.ubicacion_actual.lat = actividad.lat;
    this.ubicacion_actual.lng = actividad.lng;


    let modalDetalle = this.modalCtrl.create(ItemDetailPage, {"actividad": actividad})
    modalDetalle.present();

  }

  //carga mapa libreria g-api
  cargaMapa() {

    
    /*var i = 0;
    var marker;
    var infowindow = new google.maps.InfoWindow();

    this.plat.ready().then( ()=> {
      this.geolocation.getCurrentPosition().then( resp=>{

        //this.ub_actual = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

        //console.log("[cargaMapa] ub: " + this.ub_actual);

        this.map = new google.maps.Map(document.getElementById('map'), {

          zoom: 15,//this.ub_actual,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER
          },
          zoomControl: true,
          zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_CENTER
          },
          scaleControl: true,
          streetViewControl: false,
          streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
          },
          fullscreenControl: false,
          maxZoom: 20
        });

        console.log("[cargaMapa] carga actividades");

        this.actividades = this.actProv.cargar_todos()
          .toPromise()
          .then((res) => {
            console.log("res.json().actividades ok ");
            this.actividades = res.json().actividades;

            for (i = 0; i < this.actividades.length; i++) {

              this.arrActividades.push(this.actividades[i]);
              this.arrActivAux.push(this.actividades[i]);

              marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.actividades[i].ub_lng, this.actividades[i].ub_lat),
                map: this.map
              });

              let priv_act = this.actividades[i].privacidad;
              let content = ``;
              let fechaAct = new Date(this.actividades[i].fecha_hora).toLocaleString();

              if(priv_act == "eye"){
                console.log(priv_act);
                content = `<ion-list>
                    <ion-item>
                      <h2>`+ this.actividades[i].nombre +`</h2>
                      <p>`+ this.actividades[i].detalle +`<p>
                      <b>`+ fechaAct + `</b>
                    </ion-item>
                  </ion-list>`;
              }
              else{
                content = `<ion-list>
                    <ion-item>
                      <h3>`+ this.actividades[i].nombre +`</h3>
                      <b>`+ "privada" +`</b>
                    </ion-item>
                  </ion-list>`;
              }

              google.maps.event.addListener(marker, "dblclick", (function(this, marker, i) {

                console.log("i: " + i);

                this.zone.run(() => {
                  this.navCtrl.push(ItemDetailPage, {
                     actividad: this.actividades[i]
                  });
                });
              })(marker, i));


              google.maps.event.addListener(marker, 'click', (function(marker, i) {

                return function() {
                  infowindow.setContent(content);
                  infowindow.open(this.map, marker);
                }
              })(marker, i));
            }

        })
        .catch(function (error){
          console.log(error);
        });

        google.maps.event.addListener(this.map,'click',function(event) {
          if (infowindow) {
            infowindow.close();
          }
        });

      }).catch(()=>{
        let toast = this.toastCtrl.create({
          message: "Error al obtener posición actual.",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        return;
      });
    });*/

    //TODO codigo que obtiene posicion del click para registrar la región en la cual consultar
    //las actividades.
    // google.maps.event.addListener(map,'click',function(event) {
    //
    //     marker = new google.maps.Marker({
    //       position: event.latLng,
    //       map: map,
    //       draggable:true
    //     });
    //     map.setCenter(event.latLng);
    //     this.geocoder = new google.maps.Geocoder();
    //     this.geocoder.geocode({'latLng': event.latLng}, function(results, status) {
    //       if (status == google.maps.GeocoderStatus.OK) {
    //         console.log(results);
    //
    //         if (results[2]) {
    //           var array = results[1].formatted_address.split(',');
    //
    //           console.log(array.length);
    //
    //           if(array.length > 3){
    //             console.log("región >3: " + array[2]);
    //           }
    //           else if(array.length = 3){
    //             console.log("región =3: " + array[1]);
    //           }
    //           else{
    //             console.log("región: " + array[2]);
    //           }
    //         }
    //       }
    //     });
    // });

    // google.maps.event.addListener(map,'click',function(event) {
    //
    //
    // });
  }


  //va a la pagina para crear actividades
  crearActividad(){

    let modalDetalle = this.modalCtrl.create(ItemCreatePage, { ub_actual : this.ubicacion_actual 
    })
    modalDetalle.present();

  }


  //filtra lista de actividades por nombre
  setFilteredItems() {

      if(this.markers.length < this.arrActivAux.length){
        this.markers = this.arrActivAux;
      }

      this.markers = this.filterItems(this.searchTerm);
  }

  //metodo que filtra la lista de actividades rescatada desde el servicio.
  filterItems(searchTerm){

      return this.markers.filter((marker) => {
          return marker.nombre.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });

  }

  //boton que refresca las actividades en el mapa
  refrescar(){

    this.markers = [];
    this.arrActivAux = [];

    let loader = this.loadingCtrl.create({
      content: "Actualizando actividades...",
      duration: 2000,
      spinner: 'bubbles'
    });

    loader.present();
    
    this.getListaActividades();
  }

  //convierte el valor de string a number, para ser utilizado en el mapa (lat, lng)
  private convertStringToNumber(value: string): number {
    return +value;
  }


}