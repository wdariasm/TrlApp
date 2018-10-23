import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Cliente, TipoDocumento }  from '../../models/cliente.models';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { ClienteProvider  } from '../../providers/cliente/cliente';
import { ToastProvider } from '../../providers/toast/toast';

import { LoadingProvider } from '../../providers/loading/loading';
 
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  cliente : Cliente;
  tipoDocumentos: TipoDocumento [];
  verActualizacion : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
            private userDataProvider: UserDataProvider, private clienteProvider: ClienteProvider,
            private toastProvider: ToastProvider, private loading: LoadingProvider) {
    this.cliente = new Cliente();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    this.cliente.IdCliente = this.userDataProvider.getIdCliente();
    this.getTipoDocumentos();
    this.verActualizacion = this.userDataProvider.getTipoAcceso() == 4;
  }

  getTipoDocumentos(){
    this.clienteProvider.getDocumento().subscribe(
      result => {   
        this.tipoDocumentos = result;
        this.getCliente();
      },
      error => {
        console.log(JSON.stringify(error));
      }
    );
  }

  getCliente (){
    this.loading.show("Consultando datos... ");
    this.clienteProvider.get(this.cliente.IdCliente).subscribe(
      result => {   
        this.cliente = result;
        this.loading.hide();
      },
      error => {
        this.loading.hide();
        console.log(JSON.stringify(error));
      }
    );
  }

  guardar(frm : NgForm){
    if(frm.invalid){
      this.toastProvider.mostrarToast('Por favor ingrese los datos requeridos (*).');
      return;
    } 

    this.cliente.Nombres = this.cliente.Nombres.toUpperCase();
    this.cliente.Direccion = this.cliente.Direccion.toUpperCase();
    this.loading.show("Actualizando datos... ");
    this.clienteProvider.put(this.cliente.IdCliente, this.cliente).subscribe(
      result => {
        this.loading.hide();
        this.toastProvider.mostrarToast(result.message);
      },
      error => {
        this.loading.hide();
        this.toastProvider.mostrarToast("Error al actualizar datos");
        console.log(JSON.stringify(error));
      }
    );

  }

}
