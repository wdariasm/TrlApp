import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Usuario } from '../../models/usuario.model';

import { SesionProvider } from '../../providers/sesion/sesion';

@Component({
  selector: 'page-inicio-sesion',
  templateUrl: 'inicio-sesion.html',
})
export class InicioSesionPage {

  usuario: Usuario;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, private sessionProvider : SesionProvider ) {
    this.usuario = new Usuario();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InicioSesionPage');
  }

  mostrarToast(mensaje : string, duracion: number = 3000) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  iniciarSesion(frm: NgForm){
    if(frm.invalid){
      this.mostrarToast('Por favor ingrese los datos requeridos (*).');
      return;
    } 

    var data = {
      email: this.usuario.Login,
      password: this.usuario.Clave, 
      tipo : "APP"
    };

    this.sessionProvider.login(data).subscribe(
      result => {   
        if (result.error ){
          this.mostrarToast(" Error al autenticar. "+ result.error);
          return;
        }    
       
      },
      error => {
        let data = JSON.parse(JSON.stringify(error.error));
        if (data != null){
          this.mostrarToast(" Error al autenticar. " + data.error);
        }
        console.log(<any>error);
      }
    );

  }

}
