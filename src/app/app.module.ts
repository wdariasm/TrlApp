import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ServicioPage } from '../pages/servicio/servicio'
import { InicioSesionPage } from '../pages/inicio-sesion/inicio-sesion'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContratoProvider } from '../providers/contrato/contrato';
import { ConfiguracionProvider } from '../providers/configuracion/configuracion';
import { FuncionesComunesProvider } from '../providers/funciones-comunes/funciones-comunes';
import { ServicioProvider } from '../providers/servicio/servicio';
import { ZonaProvider } from '../providers/zona/zona';
import { isMoment } from 'moment';
import { SesionProvider } from '../providers/sesion/sesion';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage, 
    ServicioPage,
    InicioSesionPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ServicioPage,
    InicioSesionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ContratoProvider,
    ConfiguracionProvider,
    ContratoProvider,
    FuncionesComunesProvider,
    ServicioProvider, 
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ZonaProvider,
    SesionProvider,
    SesionProvider
  ]
})
export class AppModule {}
