import { Component } from '@angular/core';
import { NavParams, ViewController} from 'ionic-angular';


@Component({
  selector: 'page-confirmacion-servicio',
  templateUrl: 'confirmacion-servicio.html',
})
export class ConfirmacionServicioPage {

  responsable : string; 
  fecha : string;
  hora : string; 
  valor : number;

  constructor(private navParams: NavParams, private viewCtrl: ViewController) {
    this.responsable = this.navParams.get('responsable');  
    this.fecha = this.navParams.get('fecha');  
    this.hora = this.navParams.get('hora');  
    this.valor = this.navParams.get('valor');  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmacionServicioPage');
  }

  cerrarModal(valor: boolean){
    this.viewCtrl.dismiss({ solicitarServicio: valor});
  }

}
