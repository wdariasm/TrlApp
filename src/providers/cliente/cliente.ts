import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from  'rxjs/Observable';

import { ConfiguracionProvider } from '../configuracion/configuracion';

@Injectable()
export class ClienteProvider {

  uri : string;
  constructor(public http: HttpClient, configProvider: ConfiguracionProvider) {
    this.uri = configProvider.URL_API;
  }

  putKeyNotificacion = function (id: number, keyPush: string): Observable<any> {    
    let data  = JSON.stringify({KeyNotificacion : keyPush});
    let headers = new HttpHeaders().set('Content-Type','application/json');    
    return  this.http.put(this.uri+'/cliente/' + id + '/key', data, {headers: headers} );                  
  };

}
