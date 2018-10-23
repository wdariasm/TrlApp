import { Injectable } from '@angular/core';

@Injectable()
export class ConfiguracionProvider {

  public URL_API : string;

  Latitud: number;
  Longitud: number;
  Email : string;
  EnviarEmail : string;

  constructor() {
  
    //Local
    this.URL_API = 'http://192.168.0.23/TrlTaxi/public/api';

    //Produccion 
    //this.URL_API = 'http://www.app.trl.com.co/public/api';
    
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

  public SetKeyNotificacion(keyPush: string){
    localStorage.setItem("keyPush", "");
    localStorage.setItem("keyPush", keyPush);
  }

  public GetKeyNotificacion(): string {
    let keyPush = localStorage.getItem("keyPush");
    return keyPush;
  }

}
