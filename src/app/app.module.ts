import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Push } from '@ionic-native/push';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { ServicioPage } from '../pages/servicio/servicio';
import { InicioSesionPage } from '../pages/inicio-sesion/inicio-sesion';
import { ListadoServicioPage } from '../pages/listado-servicio/listado-servicio';
import { CerrarSesionPage } from '../pages/cerrar-sesion/cerrar-sesion';
import { DetalleServicioPage } from '../pages/detalle-servicio/detalle-servicio';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContratoProvider } from '../providers/contrato/contrato';
import { ConfiguracionProvider } from '../providers/configuracion/configuracion';
import { FuncionesComunesProvider } from '../providers/funciones-comunes/funciones-comunes';
import { ServicioProvider } from '../providers/servicio/servicio';
import { ZonaProvider } from '../providers/zona/zona';
import { isMoment } from 'moment';
import { SesionProvider } from '../providers/sesion/sesion';
import { UserDataProvider } from '../providers/user-data/user-data';
import { ClienteProvider } from '../providers/cliente/cliente';
import { ToastProvider } from '../providers/toast/toast';


@NgModule({
  declarations: [
    MyApp,
    ListPage, 
    ServicioPage,
    InicioSesionPage,
    ListadoServicioPage,
    CerrarSesionPage,
    DetalleServicioPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    ServicioPage,
    InicioSesionPage,
    ListadoServicioPage,
    CerrarSesionPage,
    DetalleServicioPage
  ],
  providers: [
    StatusBar,
    Push,
    SplashScreen,
    UserDataProvider,
    ContratoProvider,
    ConfiguracionProvider,
    ContratoProvider,
    FuncionesComunesProvider,
    ServicioProvider, 
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ZonaProvider,
    SesionProvider,
    ClienteProvider,
    ToastProvider
  ]
})
export class AppModule {}
