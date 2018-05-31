import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Servicio  } from '../../models/servicio.model';


@IonicPage()
@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  servicioForm: FormGroup;
  servicio : Servicio;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder) {
    this.servicio = new Servicio();
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicioPage');
  }

}
