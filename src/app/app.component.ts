import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ServicioPage }  from '../pages/servicio/servicio';
import { ListadoServicioPage } from '../pages/listado-servicio/listado-servicio';
import { InicioSesionPage } from '../pages/inicio-sesion/inicio-sesion';
import { CerrarSesionPage } from '../pages/cerrar-sesion/cerrar-sesion';

import { UserDataProvider  } from '../providers/user-data/user-data';
import { ConfiguracionProvider } from '../providers/configuracion/configuracion';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ListadoServicioPage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, 
              public splashScreen: SplashScreen, private userDataProvider: UserDataProvider,
              private configProvider: ConfiguracionProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Mis Servicios', component: ListadoServicioPage, icon: 'list' },
      { title : 'Servicio', component : ServicioPage , icon: 'locate' },
      { title: 'Home', component: HomePage, icon: 'home' },
      { title: 'List', component: ListPage, icon: 'list' },
      { title : 'Cerrar Sesión', component: CerrarSesionPage , icon: 'log-out'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let user = localStorage.getItem("usuario");
      if (user){
        this.rootPage = ListadoServicioPage;
        this.userDataProvider.RecuperarDatos();
        this.configProvider.RecuperarDatos();
      } else {
        this.rootPage  = InicioSesionPage;
      }
     
      this.statusBar.styleDefault();
      this.splashScreen.hide();

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
