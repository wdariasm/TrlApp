import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { ServicioProvider  } from '../../providers/servicio/servicio';
import { Servicio, Coordenada } from '../../models/servicio.model';
import { ConfiguracionProvider } from '../../providers/configuracion/configuracion';

declare var google;

@Component({
  selector: 'page-detalle-servicio',
  templateUrl: 'detalle-servicio.html',
})
export class DetalleServicioPage {

  IdServicio : number;
  servicio : Servicio;
  verConductor : boolean = false;

  posicion : Coordenada;
  mapa : any;
  directionsService : any;
  directionsDisplay: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private servicioProvider: ServicioProvider, public platform: Platform,
      private configProvider: ConfiguracionProvider) {
    // recibir valor del servicio
     this.IdServicio = this.navParams.get('IdServicio');  
     this.servicio = new Servicio();      
     this.posicion = new Coordenada();

     this.platform.ready().then(() => {      
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleServicioPage');   
    this.posicion.Latitud = this.configProvider.Latitud;
    this.posicion.Longitud = this.configProvider.Longitud; 
    this.consultarServicio();
    this.verConductor=false;
   
  }

  consultarServicio(){
    this.servicioProvider.get(this.IdServicio).subscribe(
      result => {   
        if (result == null){        
          return;
        }    
        this.servicio = result;

        if(this.servicio.ConductorId != null){
          this.verConductor = true;
        }

        if(this.servicio.TipoServicidoId != 3){  
          setTimeout(() => {
            var div1 = document.getElementById('map_canvas');                
            div1.classList.remove('hidden');
            div1.classList.add('visible');
            this.initMapa();             
          },500);     
        }

        console.log(this.servicio);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  initMapa (): void {
    console.log(this.posicion);
    let puntos = new google.maps.LatLng(this.posicion.Latitud, this.posicion.Longitud);
    let mapOptions = {
      center: puntos,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.directionsDisplay.set('directions', null);
    this.mapa = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    this.directionsDisplay.setMap(this.mapa);

    google.maps.event.addListener(this.mapa, "click", (evento) => {
      let latitud = evento.latLng.lat();
      let longitud = evento.latLng.lng();       
    });
  }

}
