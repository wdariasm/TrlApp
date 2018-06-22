import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import {  GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ServicioPage } from '../pages/servicio/servicio'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContratoProvider } from '../providers/contrato/contrato';
import { ConfiguracionProvider } from '../providers/configuracion/configuracion';
import { FuncionesComunesProvider } from '../providers/funciones-comunes/funciones-comunes';
import { ServicioProvider } from '../providers/servicio/servicio';
import { ZonaProvider } from '../providers/zona/zona';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage, 
    ServicioPage
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
    ServicioPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ContratoProvider,
    ConfiguracionProvider,
    ContratoProvider,
    FuncionesComunesProvider,
    ServicioProvider, 
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ZonaProvider
  ]
})
export class AppModule {}
