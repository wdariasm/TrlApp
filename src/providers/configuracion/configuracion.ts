import { Injectable } from '@angular/core';

@Injectable()
export class ConfiguracionProvider {

  public URL_API : string;

  Latitud: number;
  Longitud: number;
  Email : string;
  EnviarEmail : string;

  constructor() {
    //this.URL_API = 'http://localhost/TrlTaxi/public/api';
    this.URL_API = 'http://192.168.0.22/TrlTaxi/public/api';
  }


  public SetDatos(data: any){
    localStorage.setItem("config", "");
    if (data != null){
      localStorage.setItem("config", btoa(JSON.stringify(data)));
      this.Latitud = data.parLatitud;
      this.Longitud = data.parLongitud;
      this.EnviarEmail = data.parEnviarEmail;
      this.Email = data.parEmail;
    }
  }

  public RecuperarDatos(){
    if (localStorage.getItem("config")){
       this.SetDatos( JSON.parse(atob(localStorage.getItem("config"))));
    }
  }

}
