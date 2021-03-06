import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from  'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConfiguracionProvider } from '../configuracion/configuracion';

@Injectable()
export class SesionProvider {
  uri : string;
  constructor(public http: HttpClient, configProvider: ConfiguracionProvider) {
    this.uri = configProvider.URL_API;
  }

  login = function (user) : Observable<any> { 
    return this.http.post(this.uri + '/usuario/autenticar', user);
  };

  recordar = function (email) : Observable<any> { 
    var req = this.http.post(this.uri+'/usuario/recordar',email);         
    return req; 
  };

  confirmar = function(id, haskey) : Observable<any> {
      var req = this.http.get(this.uri+'/usuario/' + id +'/'+haskey+'/confirmar');
      return req;	
  };                

  verificarKey = function(idCliente, id, haskey): Observable<any>{
      var req = this.http.get(this.uri+'/usuario/' + idCliente +'/recuperar/'+ id + '/' + haskey);
      return req;	
  }; 

  udpatePass = function (id,usuario) : Observable<any> {        
      var req = this.http.put(this.uri+'/usuario/actualizar/' + id, usuario);
      return req;        
  };  
  
  getUser = function (id: number) : Observable<any> {
    var req = this.http.get(this.uri+'/usuario/' + id);
    return req;
  };

  getConfiguracion = function () : Observable<any> {
    return this.http.get(this.uri +'/parametro');
  };   

}
