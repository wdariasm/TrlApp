import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';

import { ServicioProvider  } from '../../providers/servicio/servicio';
import { Servicio, Coordenada } from '../../models/servicio.model';
import { ConfiguracionProvider } from '../../providers/configuracion/configuracion';
import { CancelarPage  } from '../cancelar/cancelar';
import { ToastProvider } from '../../providers/toast/toast';

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
  mostrarMenu : boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private servicioProvider: ServicioProvider, public platform: Platform,
      private configProvider: ConfiguracionProvider, public modalCtrl: ModalController,
      private toastProvider:ToastProvider) {
   
     this.servicio = new Servicio();      
     this.posicion = new Coordenada();

     this.platform.ready().then(() => {      
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;      
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleServicioPage');   
     // recibir valor del servicio
     this.IdServicio = this.navParams.get('IdServicio');  
     this.mostrarMenu = this.navParams.get('menu');

    this.posicion.Latitud = this.configProvider.Latitud;
    this.posicion.Longitud = this.configProvider.Longitud; 
    console.log(this.IdServicio);
    this.consultarServicio();
    this.verConductor=false;
   
  }

  consultarServicio(){
    this.servicio = new Servicio();  
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

        if(this.servicio.TipoServicidoId == 1){
          this.route(this.directionsService, this.directionsDisplay);
        } else if(this.servicio.TipoServicidoId == 4){
            this.route(this.directionsService, this.directionsDisplay);
        } else {                                  
             
          setTimeout(() => {
            let coordenada = new google.maps.LatLng(this.servicio.LatOrigen, this.servicio.LngOrigen);
            let markerOrigen = null;
            markerOrigen = new google.maps.Marker({
              position: coordenada, map: this.mapa,
              animation: google.maps.Animation.DROP, title:"Posición Cliente" ,
              icon:'blue', visible : true                     
            });                                                                  
            markerOrigen.setVisible(true);
          }, 5000);             
        }      
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  calificar(){

  }

  cancelar(){
    let profileModal = this.modalCtrl.create(CancelarPage, { 
          idServicio: this.servicio.IdServicio, 
          idCliente : this.servicio.ClienteId, 
          idConductor : this.servicio.ConductorId });
    profileModal.present();

    profileModal.onDidDismiss(data => {  
      if (data.cancelado){
        this.toastProvider.mostrarToast(data.message);
        this.navCtrl.setRoot(this.navCtrl.getActive().component, { IdServicio: this.IdServicio  , menu: true});
      }
    });
  }


  initMapa (): void {
    let puntos = new google.maps.LatLng(this.posicion.Latitud, this.posicion.Longitud);
    let mapOptions = {
      center: puntos,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.directionsDisplay.set('directions', null);
    this.mapa = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    this.directionsDisplay.setMap(this.mapa);
  }

  route(directionsService, directionsDisplay) {
    
    directionsService.route({
      origin: new google.maps.LatLng(this.servicio.LatOrigen, this.servicio.LngOrigen),
      destination:  new google.maps.LatLng(this.servicio.LatDestino, this.servicio.LngDestino),
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
         
      }
    });
  }

}
