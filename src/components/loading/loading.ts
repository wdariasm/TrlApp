import { Component } from '@angular/core';

/**
 * Generated class for the LoadingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
import { LoadingController } from 'ionic-angular';

 @Component({
  selector: 'loading',
  templateUrl: 'loading.html'
})
export class LoadingComponent {

  mensaje: string;

  loading : any;

  constructor(private  loadingCtrl: LoadingController) {
    this.show("Cargando ......");
  }

  public show (mensaje : string){
    this.mensaje = mensaje;
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange : true, 
      content : "Cargando información ... "});
    this.loading.present();
  }

  public hide() {
    this.loading.dismiss();
  }

}
