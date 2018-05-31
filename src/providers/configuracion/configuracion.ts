import { Injectable } from '@angular/core';

/*
  Generated class for the ConfiguracionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfiguracionProvider {

  public URL_API : string;

  constructor() {
    this.URL_API = '../public/api/'
    console.log('Iniciando ConfiguracionProvider Provider');
  }

}
