import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from  'rxjs/Observable';
import { ConfiguracionProvider } from '../configuracion/configuracion';

/*
  Generated class for the ZonaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ZonaProvider {
  uri : string;
  constructor(public http: HttpClient,  configProvider: ConfiguracionProvider) {
    console.log('Hello ZonaProvider Provider');
    this.uri = configProvider.URL_API;
  }

  getZona = function (latitud: number, longitud:number) : Observable<number> {
    return this.http.get(this.uri+'/zona/' + latitud + '/' +longitud);  
  };
}
