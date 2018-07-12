import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';

import { InicioSesionPage } from '../inicio-sesion/inicio-sesion';

@Component({
  selector: 'page-cerrar-sesion',
  templateUrl: 'cerrar-sesion.html',
})
export class CerrarSesionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CerrarSesionPage');
    localStorage.removeItem("config");
    localStorage.removeItem("usuario");
    this.navCtrl.setRoot(InicioSesionPage);

  }

}
