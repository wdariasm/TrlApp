import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ServicioProvider  } from '../../providers/servicio/servicio';
import { Servicio } from '../../models/servicio.model';
import { ToastProvider } from '../../providers/toast/toast';


@Component({
  selector: 'page-calificacion',
  templateUrl: 'calificacion.html',
})
export class CalificacionPage {

  idServicio : number;
  servicio : Servicio;
  calificacion : number;

  constructor(public navCtrl: NavController, private navParams: NavParams,
              private servicioProvider:ServicioProvider, private toastProvider: ToastProvider) {
    this.servicio = new Servicio();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalificacionPage');
    this.idServicio = this.navParams.get('idServicio');  
    this.consultarServicio();
  }


  consultarServicio(){
    this.servicio = new Servicio();  
    
    this.servicioProvider.get(this.idServicio).subscribe(
      result => {   
        if (result == null){        
          return;
        }    
        this.servicio = result;    

        if (this.servicio.Calificacion > 0){
           this.toastProvider.mostrarToast("Estimado Cliente, el servicio ya ha sido calificado.", 5000);
           this.calificacion = this.servicio.Calificacion;
           console.log(this.calificacion);
        }
         
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  calificar(){

    if (this.servicio.IdServicio == null){
      this.toastProvider.mostrarToast("No se puede calificar el servicio. Servicio no asignado.", 5000);
      return;
    }

    if (this.servicio.Estado !== 'FINALIZADO'){
      this.toastProvider.mostrarToast("No se puede calificar el servicio. Servicio no ha finalizado.", 5000);
      return;
    }

    if (this.calificacion == 0){
      this.toastProvider.mostrarToast("Estimado Cliente, por favor indique la calificación.", 5000);
    }

    let obj = {
      Calificacion : this.calificacion
    }

    this.servicioProvider.calificar(this.idServicio, obj).subscribe(
      result => {   
        this.toastProvider.mostrarToast(result.message, 5000);
      },
      error => {
        this.toastProvider.mostrarToast(error.data);
        console.log(JSON.stringify(error));
      }
    );


  }

}
