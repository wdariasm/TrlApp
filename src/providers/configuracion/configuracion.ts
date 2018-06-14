import { Injectable } from '@angular/core';

@Injectable()
export class ConfiguracionProvider {

  public URL_API : string;

  constructor() {
    this.URL_API = 'http://192.168.0.23/TrlTaxi/public/api';
  }

}
