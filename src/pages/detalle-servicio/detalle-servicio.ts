import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioProvider  } from '../../providers/servicio/servicio';
import { Servicio } from '../../models/servicio.model';

@Component({
  selector: 'page-detalle-servicio',
  templateUrl: 'detalle-servicio.html',
})
export class DetalleServicioPage {

  IdServicio : number;
  servicio : Servicio;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private servicioProvider: ServicioProvider) {
    // recibir valor del servicio
     this.IdServicio = this.navParams.get('IdServicio');  
     this.servicio = new Servicio();   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleServicioPage');    
    this.consultarServicio();
  }

  consultarServicio(){
    this.servicioProvider.get(this.IdServicio).subscribe(
      result => {   
        if (result == null){        
          return;
        }    
        this.servicio = result;
        console.log(this.servicio);
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
