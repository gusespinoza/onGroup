import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { URL_SERVICIOS } from './config/url.services';


@Injectable()
export class Actividades {

  constructor(public http: Http, public api: Api) {
  }

  query(params?: any) {
    return this.api.get('/items', params)
      .map(resp => resp.json());
  }

  cargar_todos(){

    let url = URL_SERVICIOS + "actividades/todos";
    return this.http.get(url);
  }

  cargar_todos_mapa(){

    let url = URL_SERVICIOS + "actividades/todos";
    return this.http.get(url)
        .map(res => res.json());
  }

}
