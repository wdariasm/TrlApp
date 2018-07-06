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

  get = function (id:number) {
    var req = this.http.get(this.uri+'/contrato/' + id);
    return req;
  };

  getByNumeroContrato(numeroContrato: string): Observable<any>{
    return this.http.get(this.uri+ '/contrato/' + numeroContrato + '/tiposervicio');
  }

  getByCliente(id:number , estado: string): Observable<any> { 
    return this.http.get(this.uri+'/cliente/'+ id + '/contratos/' + estado);
  };

  getTipoVehiculo = function (id:number,tipo: number) {
    return this.http.get(this.uri+'/plantilla/' + id + '/tiposervicio/'+tipo+'/tipovehiculo');
  };

  getTransfert = function (plantilla:number, tipo:number, origen:number, destino:number): Observable<any>{
    var req = this.http.get(this.uri+'/transfert/' + plantilla + '/' + tipo + '/' + origen + '/'+destino);
    return req;
  };

  getValorParada = function (idPlantilla:number) : Observable<any> {
    return this.http.get(this.uri+ '/plantilla/' + idPlantilla + '/parada');
  };

  getRutas = function (idPlantilla: number) : Observable<any> {
    return  this.http.get(this.uri+'/plantilla/' + idPlantilla + '/ruta');
  };

  getTiposVehiculos = function () : Observable<any> {
    return this.http.get(this.uri + '/tipoVehiculo');
  };

  getDisponibilidad = function (plantilla:number, tipo:number): Observable<any> {
    return this.http.get(this.uri+'/disponibilidad/plantilla/' + plantilla + '/tipo/' + tipo );
  };

  getTraslados = function (idPlantilla: number): Observable<any> {
    return  this.http.get(this.uri+'/plantilla/' + idPlantilla + '/traslado');
  }; 

}
