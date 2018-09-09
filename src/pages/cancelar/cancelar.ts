import { Component } from '@angular/core';
import { NavParams, ViewController  } from 'ionic-angular';

import { ServicioProvider } from  '../../providers/servicio/servicio';
import { MotivoCancelacion } from '../../models/servicio.model';


@Component({
  selector: 'page-cancelar',
  templateUrl: 'cancelar.html',
})
export class CancelarPage {

  idServicio : number;
  idConductor : number;
  motivosCancelacion : MotivoCancelacion[];
  motivo : string;
  idCliente : number;
  
  

  constructor(public navParams: NavParams, public viewCtrl: ViewController,
              private servicioProvider: ServicioProvider) {
      // recibir valor del servicio
      this.idServicio = this.navParams.get('idServicio');  
      this.idConductor = this.navParams.get('idConductor');  
      this.idCliente = this.navParams.get('idCliente');  
  }

  ionViewDidLoad() {
    this.getMovitosCancelacion();
    this.motivo = "0";
  }

  cerrarModal(){
    this.viewCtrl.dismiss({ cancelado: false});
  }

  getMovitosCancelacion(){
    this.servicioProvider.getMotivos("CLIENTE").subscribe(
      result => {
        this.motivosCancelacion = result;
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
  }

  cancelarServicio(){
    if (this.motivo == "0"){
      return;
    }

    let  objCancelacion = {
        Conductor  : this.idConductor,
        Estado : "CANCELADO",
        Motivo : this.motivo,
        Cliente : this.idCliente
    };

    this.servicioProvider.cancelar(this.idServicio, objCancelacion).subscribe(
      result => {
        this.viewCtrl.dismiss({ cancelado: true, mensaje: result.message});
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );



   
  }

}
