import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { ServicioProvider }  from '../../providers/servicio/servicio';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { Servicio } from '../../models/servicio.model';


@Component({
  selector: 'page-listado-servicio',
  templateUrl: 'listado-servicio.html',
})
export class ListadoServicioPage {

  servicios : Servicio[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private servicioProvider : ServicioProvider, private userDataProvider : UserDataProvider,
              private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoServicioPage');
    this.consultarServicios();
  }

  mostrarToast(mensaje : string, duracion: number = 3000) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  consultarServicios(): void {
    this.servicioProvider.getAll(this.userDataProvider.getIdCliente(), 
      this.userDataProvider.getTipoAcceso(), this.userDataProvider.getLogin()).subscribe(
      result => {        
          if (result != null){
            this.servicios = result;
          } else {
            this.mostrarToast("No hay resultados de servicios.");
          }
      },
      error => {
        console.log(<any>error);
        this.mostrarToast("Error al consultar servicios. ");
      }
    );
  }

}
