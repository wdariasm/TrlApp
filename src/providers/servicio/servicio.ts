import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from  'rxjs/Observable';

import { ConfiguracionProvider } from '../configuracion/configuracion';
import { Servicio } from '../../models/servicio.model'
import { Contacto } from '../../models/contacto.model';
import { Parada } from '../../models/parada.model';


/*
  Generated class for the ServicioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicioProvider {
  uri : string;
  constructor(public http: HttpClient, configProvider: ConfiguracionProvider) {
    this.uri = configProvider.URL_API;
  }

  get = function (id: number): Observable<Servicio> {
    return  this.http.get(this.uri+'/servicio/'+id);
  };

  post = function (servicio: Servicio): Observable<any> {
    let data  = JSON.stringify(servicio);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return  this.http.post(this.uri+'/servicio', data, {headers: headers}); 
  };   

  put = function (id: number, servicio: Servicio): Observable<any> {    
    let data  = JSON.stringify(servicio);
    let headers = new HttpHeaders().set('Content-Type','application/json');    
    return  this.http.put(this.uri+'/servicio/' + id + '/actualizar', data, {headers: headers} );                  
  };

  getAll = function (idCliente: number, rol, user: string) : Observable<any> {
    return  this.http.get(this.uri+'/cliente/' + idCliente + "/servicios/" + rol + "/" + user  + "/" + 10);
  }; 

  getConductor = function (id: number) : Observable<any> {
      return  this.http.get(this.uri+'/conductor/' + id + "/vehiculo");
  }; 

  cancelar = function (id:number, servicio : any): Observable<any> {     
    let data  = JSON.stringify(servicio);
    let headers = new HttpHeaders().set('Content-Type','application/json');       
    return  this.http.put(this.uri+'/servicio/' + id + '/cancelar', data, {headers: headers} );       
  };

  getMotivos = function (modulo) : Observable<any> {
    return  this.http.get(this.uri+'/motivo/' + modulo);
  };

  eliminarContacto = function (id: number) : Observable<any> {
    return  this.http.delete(this.uri+'/contacto/' + id);  
  };

  getContactos = function (idServicio: number) : Observable<Contacto[]> {
      return  this.http.get(this.uri+'/contacto/' + idServicio);
  };        

  agregarContacto = function (contacto: Contacto) : Observable<any> {
    let data  = JSON.stringify(contacto);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return  this.http.post(this.uri+'/contacto',data, {headers: headers} ); 
  };
      
  agregarParada = function (parada: Parada) : Observable<any> {
    let data  = JSON.stringify(parada);
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return  this.http.post(this.uri+'/parada',data, {headers: headers} ); 
  };

  eliminarParada = function (idParada : number) : Observable<any> {
    return  this.http.delete(this.uri+'/parada/' + idParada);
  };

  getParadas = function (idServicio: number) : Observable<Parada[]> {
      return  this.http.get(this.uri + '/parada/' + idServicio);
  }; 

  calificar = function (id, objeto): Observable<any> { 
    let data  = JSON.stringify(objeto);
    let headers = new HttpHeaders().set('Content-Type','application/json');  
    return  this.http.put(this.uri + '/servicio/calificar/' + id, data,{ headers : headers} );    
  };

}
