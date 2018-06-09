import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ServicioPage } from '../pages/servicio/servicio';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContratoProvider } from '../providers/contrato/contrato';
import { ConfiguracionProvider } from '../providers/configuracion/configuracion';
import { FuncionesComunesProvider } from '../providers/funciones-comunes/funciones-comunes';
import { ServicioProvider } from '../providers/servicio/servicio';

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
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ContratoProvider,
    ConfiguracionProvider,
    ContratoProvider,
    FuncionesComunesProvider,
    ServicioProvider
  ]
})
export class AppModule {}
