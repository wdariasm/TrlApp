import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { ServicioPage }  from '../pages/servicio/servicio';
import { ListadoServicioPage } from '../pages/listado-servicio/listado-servicio';
import { InicioSesionPage } from '../pages/inicio-sesion/inicio-sesion';
import { CerrarSesionPage } from '../pages/cerrar-sesion/cerrar-sesion';
import { DetalleServicioPage } from '../pages/detalle-servicio/detalle-servicio';
import { CalificacionPage } from '../pages/calificacion/calificacion';
import { PerfilPage } from '../pages/perfil/perfil';

import { UserDataProvider  } from '../providers/user-data/user-data';
import { ConfiguracionProvider } from '../providers/configuracion/configuracion';
import { ClienteProvider } from '../providers/cliente/cliente';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = InicioSesionPage;

  pages: Array<{title: string, component: any, icon: string}>;
  idCliente : number = 0;

  constructor(public platform: Platform, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, private userDataProvider: UserDataProvider,
              private configProvider: ConfiguracionProvider, public push: Push,
              public toastCtrl: ToastController, private clienteProvider: ClienteProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Mis Servicios', component: ListadoServicioPage, icon: 'list' },
      { title : 'Servicio', component : ServicioPage , icon: 'locate' },
      { title : 'Perfil', component: PerfilPage , icon: 'contact'},
      { title : 'Cerrar Sesión', component: CerrarSesionPage , icon: 'log-out'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let user = localStorage.getItem("usuario");
      this.idCliente = 0;
      if (user){
        this.clienteProvider.getToken().subscribe( result => {
          this.userDataProvider.SetToken(result.token);
          this.userDataProvider.RecuperarDatos();
          this.idCliente = this.userDataProvider.getIdCliente();
          this.configProvider.RecuperarDatos();
          this.rootPage = ListadoServicioPage;
        },

        error => {
          let data = JSON.parse(JSON.stringify(error));
          if (data != null){
            this.mostrarToast("Error al actualizar token.. Debe iniciar sesión nuevamente. ", 5000);
          }
          console.log(<any>error);
          this.rootPage = InicioSesionPage;
        }
        
        );
        
      } else {
        this.rootPage  = InicioSesionPage;
      }
      
      this.pushSetting();
      //this.permisoNotificacion();

      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  pushSetting(){
    const options: PushOptions = {
      android: {
        senderID: "358053439592",
        vibrate : true,
        sound: true,
        forceShow:true, 
        icon : 'assets/imgs/notificacion.png'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: true
      }
   };
   
    const pushObject: PushObject = this.push.init(options);
   
    //pushObject.on('notification').subscribe((notification: any) => this.mostrarToast(JSON.stringify(notification), 10000));
    //pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
    
    pushObject.on('notification').subscribe(notificacion => {
      if (notificacion.additionalData.pagina == 1){
        this.nav.push(DetalleServicioPage, { IdServicio: notificacion.additionalData.codigo});
      }

      else if (notificacion.additionalData.pagina == 2){
        this.nav.push(CalificacionPage, { idServicio: notificacion.additionalData.codigo});
      }
    });

    pushObject.on('registration').subscribe(data => {
      if (this.idCliente != 0){
        this.clienteProvider.putKeyNotificacion(this.idCliente, data.registrationId).subscribe(
          result => {        
            console.log(result);
          },
          error => {
            console.log(JSON.stringify(error));
            this.mostrarToast("Error al actualizar key de notifiación push ");
          }
        );
      } else {
        this.configProvider.SetKeyNotificacion(data.registrationId);
      }
    });
   
    pushObject.on('error').subscribe(error => this.mostrarToast('Error obtener key de notificación' +error.message));
  }

  permisoNotificacion(){
    this.push.hasPermission()
    .then((res: any) => {

      if (res.isEnabled) {
        this.mostrarToast('Permiso concedido para notificaciones push');
      } else {
        this.mostrarToast('Estimado usuario, le sugerimos aceptar las notificaciones push');
      }
    }); 

  }

  mostrarToast(mensaje : string, duracion: number = 3000) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }
}
