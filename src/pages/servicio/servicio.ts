import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Servicio  } from '../../models/servicio.model';
import { Asignacion }  from '../../models/asignacion.model'; 
import { Traslado } from '../../models/traslado.model';
import { TipoVehiculo } from '../../models/tipo.vehiculo.model';
import { Contacto } from '../../models/contacto.model';
import { Parada } from '../../models/parada.model';



@IonicPage()
@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  servicioForm: FormGroup;
  servicio : Servicio;
  opcion : string = "Contrato"; // Opcion de tab 
  asignacion : Asignacion;
  trasladoSelect : Traslado;  //traslado seleccionado
  tipoSelect : TipoVehiculo; //Tipo de vehiculo seleccionado
  contacto : Contacto;
  parada : Parada;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder, public toastCtrl: ToastController) {
    
    this.asignacion = new Asignacion(false, "Origen", "ida");
    this.trasladoSelect  = new Traslado();
    this.tipoSelect = new TipoVehiculo();
    this.servicio = new Servicio();
    this.contacto =  new Contacto();
    this.parada = new Parada();
    
    this.servicio.ModoServicio = "PROGRAMADO";

  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicioPage');
  }

  mostrarToast(mensaje : string) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }


  //FUNCIONES DE CONTACTO

  agregarContacto(): void {
    if (this.contacto.scNombre == null || this.contacto.scNombre == ""){
      this.mostrarToast("Por favor ingrese el nombre del Responsable.");
      return;
    }

    if (this.contacto.scTelefono == null || this.contacto.scTelefono == ""){
      this.mostrarToast("Por favor ingrese el número de teléfono.");
      return;
    }

    this.servicio.Contactos.push(this.contacto);

    this.contacto = new Contacto();

  }

  

}


