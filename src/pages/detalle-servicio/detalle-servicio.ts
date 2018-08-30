import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetalleServicioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detalle-servicio',
  templateUrl: 'detalle-servicio.html',
})
export class DetalleServicioPage {

  IdServicio : number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // recibir valor del servicio
     this.IdServicio = this.navParams.get('IdServicio');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalleServicioPage');
  }

}
