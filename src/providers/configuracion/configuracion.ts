import { Injectable } from '@angular/core';

@Injectable()
export class ConfiguracionProvider {

  public URL_API : string;

  constructor() {
    this.URL_API = 'http://localhost/TrlTaxi/public/api';
  }

}
