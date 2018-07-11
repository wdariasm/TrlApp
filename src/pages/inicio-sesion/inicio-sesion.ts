import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { Usuario } from '../../models/usuario.model';

import { SesionProvider } from '../../providers/sesion/sesion';
import { UserDataProvider } from '../../providers/user-data/user-data';

import {ServicioPage }  from '../servicio/servicio';

@Component({
  selector: 'page-inicio-sesion',
  templateUrl: 'inicio-sesion.html',
})
export class InicioSesionPage {

  usuario: Usuario;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, private sessionProvider : SesionProvider,
              private userDataProvider: UserDataProvider ) {
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
        this.userDataProvider.SetDatosToken(result.token);
        let idUsuario  = this.userDataProvider.getIdUsuario();

        if (idUsuario != null){
          this.getUser(idUsuario);
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

  getUser (idUsuario : number) : void {
    this.sessionProvider.getUser(idUsuario).subscribe(
      result => {   
        if (!result){
          this.mostrarToast(" Error al obtener datos del usuario. "+ result);
          return;
        }   
        this.userDataProvider.SetDatos(result);
        this.navCtrl.push(ServicioPage);
      },
      error => {
        this.mostrarToast(" Error al autenticar. " + error);
        console.log(<any>error);
      }
    );
  }

}
