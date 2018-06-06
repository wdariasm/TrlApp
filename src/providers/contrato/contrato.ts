import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfiguracionProvider } from '../configuracion/configuracion';
import { Observable } from  'rxjs/Observable';

import  'rxjs/add/operator/catch';

import  'rxjs/add/operator/map';

/*
  Generated class for the ContratoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContratoProvider {

  uri : string;

  constructor(public http: HttpClient, configProvider: ConfiguracionProvider) {
    console.log('Hello ContratoProvider Provider');
    this.uri = configProvider.URL_API;
  }

  getByCliente(id:number , estado: string): Observable<any> { 
    return this.http.get(this.uri+'/cliente/'+ id + '/contratos/' + estado);
  };

  getByNumeroContrato(numeroContrato: string): Observable<any>{
    return this.http.get(this.uri+ '/contrato/' + numeroContrato + '/tiposervicio');
  }

  getValorParada = function (idPlantilla:number) : Observable<any> {
    return this.http.get(this.uri+ '/plantilla/' + idPlantilla + '/parada');
  };

  getTipoVehiculo = function (id:number,tipo: number) {
    return this.http.get(this.uri+'/plantilla/' + id + '/tiposervicio/'+tipo+'/tipovehiculo');
  };

  getTiposVehiculos = function () : Observable<any> {
    return this.http.get(this.uri + '/tipoVehiculo');
  };

  getRutas = function (idPlantilla: number) : Observable<any> {
    return  this.http.get(this.uri+'/plantilla/' + idPlantilla + '/ruta');
  };

  getTraslados = function (idPlantilla: number) {
    return  this.http.get(this.uri+'/plantilla/' + idPlantilla + '/traslado');
  };

}
