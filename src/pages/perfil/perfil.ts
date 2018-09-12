import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Cliente, TipoDocumento }  from '../../models/cliente.models';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { ClienteProvider  } from '../../providers/cliente/cliente';
import { ToastProvider } from '../../providers/toast/toast';
 
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
            private toastProvider: ToastProvider) {
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
    this.clienteProvider.get(this.cliente.IdCliente).subscribe(
      result => {   
        this.cliente = result;
      },
      error => {
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

    this.clienteProvider.put(this.cliente.IdCliente, this.cliente).subscribe(
      result => {
        this.toastProvider.mostrarToast(result.message);
      },
      error => {
        this.toastProvider.mostrarToast("Error al actualizar datos");
        console.log(JSON.stringify(error));
      }
    );

  }

}
