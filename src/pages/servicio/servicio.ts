import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController, 
        ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { NgForm } from '@angular/forms';

import { Servicio, Coordenada  } from '../../models/servicio.model';
import { Asignacion }  from '../../models/asignacion.model'; 
import { Traslado } from '../../models/traslado.model';
import { TipoVehiculo } from '../../models/tipo.vehiculo.model';
import { Contacto } from '../../models/contacto.model';
import { Parada } from '../../models/parada.model';
import { ContratoServicio, ContratoPlantilla } from '../../models/contrato.servicio.model';
import { Contrato } from '../../models/contrato.model';
import { Ruta } from '../../models/ruta.model';

import { UserDataProvider } from '../../providers/user-data/user-data';
import { ContratoProvider } from '../../providers/contrato/contrato';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
import { ServicioProvider } from '../../providers/servicio/servicio';
import { ZonaProvider } from '../../providers/zona/zona';
import { ConfiguracionProvider } from '../../providers/configuracion/configuracion';
import * as moment from 'moment';

declare var google;

@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html'
})
export class ServicioPage {

  servicio : Servicio;
  opcionTab : string = "1"; // Opcion de tab 
  asignacion : Asignacion;
  trasladoSelect : Traslado;  //traslado seleccionado
  tipoSelect : TipoVehiculo; //Tipo de vehiculo seleccionado
  contacto : Contacto;
  parada : Parada;
  subTotal : number = 0;
  contratos : Contrato[] = [];
  contratoSelect : Contrato;
  contrato : ContratoServicio;
  editar : boolean;
  tituloPlantilla : string;
  editModoServicio :boolean;
  editTipoVehiculo : boolean;
  plantilla : ContratoPlantilla;
  lstRutas : Ruta [];
  rutaSelect : Ruta;
  lstTraslados : Traslado [];
  aceptarCondicion : boolean;
  btnSiguiente : boolean = false;
  btnAnterior : boolean = true;
 
  // Variables para el servicio de mapas
  posicion : Coordenada;
  mapa : any;
  mapElement;
  autocompleteDestino;

  origenPlaceId = null;
  destinoPlaceId = null;
  travelMode : any;
  directionsService : any;
  directionsDisplay: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController, public contratoProvider: ContratoProvider,
              public funcionesProvider: FuncionesComunesProvider, public platform: Platform,
              public servicioProvider : ServicioProvider, private geolocation: Geolocation, 
              private zonaProvider: ZonaProvider, private alertCtrl: AlertController,
              private userDataProvider : UserDataProvider, private configProvider: ConfiguracionProvider
              
            ) 
  {
    this.platform.ready().then(() => {
      this.travelMode = google.maps.TravelMode.DRIVING;
      this.directionsService = new google.maps.DirectionsService;
      this.directionsDisplay = new google.maps.DirectionsRenderer;
      this.initClases();
    });
  }
  

  ionViewDidLoad() {
    this.ubicacionAutomatica(true);
    this.initDatos();
    this.getContratos();
  }

  initClases(){
    this.asignacion = new Asignacion(false, "Origen", "ida");
    this.trasladoSelect  = new Traslado();
    this.tipoSelect = new TipoVehiculo();
    this.servicio = new Servicio();
    this.contacto =  new Contacto();
    this.parada = new Parada();
    this.plantilla = new ContratoPlantilla();
    this.posicion = new Coordenada();
    this.contrato = new ContratoServicio();
  }

  initDatos(){

    /** 
     * OPCIONES DE TAB A TENER EN CUENTA
     * Contrato -> 1
     * TipoServicio -> 2
     * Direccion -> 3
     * Responsable -> 4
     * Paradas -> 5
     * Pago -> 6
     * **/

    this.opcionTab = "1";
    this.servicio.ModoServicio = "PROGRAMADO";
    this.servicio.ClienteId = this.userDataProvider.getIdCliente();
    this.servicio.UserReg =  this.userDataProvider.getLogin();
    this.servicio.EnviarEmail = this.configProvider.EnviarEmail; 
    this.servicio.ParEmail = this.configProvider.Email;
    this.lstRutas = [];
    this.lstTraslados = [];
    this.rutaSelect = new Ruta();
    this.editar = false;
    this.editTipoVehiculo =true;
    this.editModoServicio = true;
    this.servicio.FechaServicio = moment().format('L');
    this.servicio.HoraControl = moment().format("HH:mm");
    this.posicion.Latitud = this.configProvider.Latitud;
    this.posicion.Longitud = this.configProvider.Longitud;

    console.log(this.posicion.Longitud);
  }

  // FUNCIONES DE MAPAS 
  ubicacionAutomatica(load: boolean): void {
    this.geolocation.getCurrentPosition({enableHighAccuracy:true, maximumAge: 30000, timeout:7000})
    .then((resp) => {
      console.log(resp.coords.latitude);
      console.log(resp.coords.longitude);
      
      if (load){
        this.posicion.Latitud = resp.coords.latitude;
        this.posicion.Longitud = resp.coords.longitude;
      } else {
        this.servicio.LatOrigen = resp.coords.latitude.toString();
        this.servicio.LngOrigen = resp.coords.longitude.toString();
      }

      //this.mostrarToast(resp.coords.latitude + ' '+ resp.coords.longitude);
      
     }).catch((error) => {
       let msjError = "Error al obtener ubicación. ";
       console.log("-- " + error.message);
       if (error.code == 1){
          msjError = "Estimado Usuario(a) para el correcto funcionamiento de la aplicación, " +
          " se requiere el permiso para acceder a su ubicación. "
       } else {
         msjError = msjError + error.message;
       }

       this.mostrarToast(msjError, 7000);
       console.log('Error getting location', JSON.stringify(error));
     }); 
  }

  initMapa (): void {
    let puntos = new google.maps.LatLng(this.posicion.Latitud, this.posicion.Longitud);
    let mapOptions = {
      center: puntos,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.directionsDisplay.set('directions', null);
    this.mapa = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    this.directionsDisplay.setMap(this.mapa);

   this.initAutocomplete();
   let markerOrigen = null;
   let markerDestino = null;
    google.maps.event.addListener(this.mapa, "click", (evento) => {
      let latitud = evento.latLng.lat();
      let longitud = evento.latLng.lng();   
    
      if(this.asignacion.Manual){
       
        let coordenadas = new google.maps.LatLng(latitud, longitud); 
        switch (this.asignacion.Marcador) {
          case "Origen":     
            if(markerOrigen !== null){
              markerOrigen.setMap(null);
            }
            markerOrigen = new google.maps.Marker ({
                position:  coordenadas, map: this.mapa,
                animation: google.maps.Animation.DROP,
                title:"Posición de Origen",
                icon:'blue'
            });                        
            //this.markerOrigen.setMap(this.mapa);  
            markerOrigen.setVisible(true);
  
            this.servicio.LatOrigen = latitud;
            this.servicio.LngOrigen = longitud;
            this.buscarZona(this.servicio.LatOrigen, this.servicio.LngOrigen,"ZonaOrigen"); 
            break;                  
          case "Destino":     
            if(markerDestino !== null){
              markerDestino.setMap(null);
            }
            markerDestino = new google.maps.Marker ({
                position: coordenadas, map: this.mapa,
                animation: google.maps.Animation.DROP,
                title:"Posición de Destino",
                icon:'red',
            });       
            markerDestino.setVisible(true);
            this.servicio.LatDestino = latitud;
            this.servicio.LngDestino = longitud;
            this.buscarZona(this.servicio.LatDestino, this.servicio.LngDestino, 'ZonaDestino'); 
            break; 
          default:
              this.mostrarToast("Por favor seleccione la posicion a establecer Origen o Destino.");
              break;
        }
        
        this.getGeocoder(coordenadas);
      } 
    });
  }

  getGeocoder(coordenadas): void {  
    
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': coordenadas }, (results, status)=>{
      var direccion ="";
      if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {                             
              direccion = results[0].formatted_address.split(" a ",1);                 
          } else {
          this.mostrarToast('Google no retorno resultado alguno.');
          }
      } else {
        console.log("Geocoding fallo debido a : " + status);
      }

      if(this.asignacion.Marcador == "Destino"){
          this.servicio.DireccionDestino = direccion[0];           
      }else{
          this.servicio.DireccionOrigen = direccion[0];
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

  initAutocomplete (): void {
    let options : any = {  componentRestrictions: {country: 'co'} };
    let input = document.getElementById('txtOrigen').getElementsByTagName('input')[0];
    let autocompleteOrigen = new google.maps.places.Autocomplete(input, options);
    autocompleteOrigen.bindTo('bounds', this.mapa);

    autocompleteOrigen.addListener('place_changed',()=> {
      //infowindow.close();
      //this.markerOrigen.setVisible(false);
      let place = autocompleteOrigen.getPlace();
      if (!place.geometry) {
          this.mostrarToast('No se pudo resolver la  posición');
          return;
      }
      this.expandViewportToFitPlace(this.mapa, place);                      
                  
      this.servicio.LatOrigen = place.geometry.location.lat();
      this.servicio.LngOrigen  = place.geometry.location.lng();            
      this.servicio.DireccionOrigen =  place.formatted_address;            

      if(this.servicio.Tipo.csTipoServicioId == 1){
          this.buscarZona(this.servicio.LatOrigen, this.servicio.LngOrigen,"ZonaOrigen");
          this.origenPlaceId = place.place_id;
          this.route(this.origenPlaceId, this.destinoPlaceId, this.travelMode, this.directionsService, this.directionsDisplay);
      } else if(this.servicio.Tipo.csTipoServicioId == 4){
          this.origenPlaceId = place.place_id;
          this.route(this.origenPlaceId, this.destinoPlaceId, this.travelMode, this.directionsService, this.directionsDisplay);
      } else {                                  
          var coordenada = new google.maps.LatLng(this.servicio.LatOrigen, this.servicio.LngOrigen);
          let markerOrigen = null;
          markerOrigen = new google.maps.Marker({position: coordenada, map: this.mapa,
              animation: google.maps.Animation.DROP, title:"Posición Cliente"                         
          });                                                                      
          markerOrigen.setVisible(true);            
      }            
    });
  }

  initAutocompleteDestino (){
  
    if (this.servicio.Tipo.csTipoServicioId == 2 || this.servicio.Tipo.csTipoServicioId == 3) return;
    
    let options : any = {  componentRestrictions: {country: 'co'} };
    let input = document.getElementById('txtDestino').getElementsByTagName('input')[0];

    this.autocompleteDestino = new google.maps.places.Autocomplete(input, options);
    this.autocompleteDestino.bindTo('bounds', this.mapa);

    this.autocompleteDestino.addListener('place_changed', () => {            
        var place = this.autocompleteDestino.getPlace();
        if (!place.geometry) {
            this.mostrarToast('No pudo resolver la  posición');
            return;
        }
        this.expandViewportToFitPlace(this.mapa, place);
        this.servicio.LatDestino = place.geometry.location.lat();
        this.servicio.LngDestino  = place.geometry.location.lng();            
        this.servicio.DireccionDestino =  place.formatted_address;
                  
        if(this.servicio.Tipo.csTipoServicioId == 1){
            this.buscarZona(this.servicio.LatDestino, this.servicio.LngDestino, 'ZonaDestino');                
        }
        
        this.destinoPlaceId = place.place_id;
        this.route(this.origenPlaceId, this.destinoPlaceId, this.travelMode, this.directionsService, this.directionsDisplay);
        
    });
  }

  route(origin_place_id, destination_place_id, travel_mode, directionsService, directionsDisplay) {
    if (!origin_place_id || !destination_place_id) {
      return;
    }
    directionsService.route({
      origin: {'placeId': origin_place_id},
      destination: {'placeId': destination_place_id},
      travelMode: travel_mode
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
          this.mostrarToast('Error al resolver dirección');
      }
    });
  }

  routePosicion(origen, destino, travel_mode, directionsService, directionsDisplay) {
    if (!origen || !destino) {
      return;
    }
    directionsService.route({
      origin: origen,
      destination:  destino,
      travelMode: travel_mode
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {              
        directionsDisplay.setDirections(response);
      } else {
       this.mostrarToast('Error al resolver dirección');
      }
    });
  }

  expandViewportToFitPlace(map, place): void {
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
      console.log("estoy en else");
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
  }

  buscarZona(latitud, longitud, opcion){
    this.zonaProvider.getZona(latitud, longitud).subscribe(
      result => {        
          if (result != 0){
            this.servicio[opcion] = result;
          } else {
            this.mostrarToast("Estimado Usuario(a), No se encontro la zona");
          }
      },
      error => {
        console.log(<any>error);
        this.mostrarToast("Error al buscar zona. ");
      }
    );
  }

  buscarValorParada(): void{
    this.contratoProvider.getValorParada(this.plantilla.plCodigo).subscribe(
      result => {        
          if (result != null){
            this.servicio.ValorParadaProveedor = parseInt(result.plValorProveedor);
            this.servicio.ValorParadaCliente = parseInt(result.plValorCliente);
          } else {
            this.mostrarToast("Estimado Usuario(a), no se encontró el valor de parada para esta plantilla.");
          }
      },
      error => {
        console.log(<any>error);
        this.mostrarToast("Error al buscar parada. ");
      }
    );
  }

  getTipoVehiculo (id: number, tipo: number): void {
    this.contratoProvider.getTipoVehiculo(id, tipo).subscribe(
      result => {    
        this.contrato.TipoVehiculo = result;
        if (this.contrato.TipoVehiculo.length > 0){
          this.tipoSelect = this.contrato.TipoVehiculo[0];
        }

        if(this.editar){                
          var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.TipoVehiculo, this.servicio.TipoVehiculoId, 'tfTipoVehiculo');        
          if(pos >=0){                            
              this.tipoSelect = this.contrato.TipoVehiculo[pos];
          }                 
        }
      },
      error => {
        this.mostrarToast("Error al cargar tipos de vehículo.");
        console.log(<any>error);
      }
    );
  }

  getTiposVehiculos():void {   
    
    this.contratoProvider.getTiposVehiculos().subscribe(
      result => {        
        this.contrato.TipoVehiculo = result;
        if(this.editar){
          var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.TipoVehiculo, this.servicio.TipoVehiculoId, 'tvCodigo');        
          if(pos >=0){                            
              this.tipoSelect = this.contrato.TipoVehiculo[pos];
          } 
        }
      },
      error => {
       this.mostrarToast("Error al cargar tipos de vehículo.");
        console.log(<any>error);
      }
    );
  }

  getRutas(idPlantilla): void  {

    this.contratoProvider.getRutas(idPlantilla).subscribe(
      result => {   
        this.lstRutas= result;
        if(this.editar){
          var pos1 = this.funcionesProvider.arrayObjectIndexOf(this.lstRutas, this.servicio.DetallePlantillaId, 'rtCodigo');        
          if(pos1 >=0){                            
              this.rutaSelect = this.lstRutas[pos1];                    
              if( this.servicio.ValorCliente >  this.rutaSelect.rtValorCliente ){
                  this.asignacion.Ruta = "doble";
              }
          }                                                                
        }
      },
      error => {
        console.log(<any>error);
        this.mostrarToast("Error al cargar rutas.");
      }
    );
  }

  getTraslados(idPlantilla: number): void {

    this.contratoProvider.getTraslados(idPlantilla).subscribe(
      result => {        
        this.lstTraslados= result;
        if(this.editar){                                
          var pos1 = this.funcionesProvider.arrayObjectIndexOf(this.lstTraslados, this.servicio.DetallePlantillaId, 'tlCodigo');        
          if(pos1 >=0){                            
            this.trasladoSelect = this.lstTraslados[pos1];                    
          }                                                                
        }
      },
      error => {
        this.mostrarToast("Error al cargar traslados.");
        console.log(<any>error);
      }
    );
  }

  getContratos(): void {
    this.contratoProvider.getByCliente(this.servicio.ClienteId, 'ACTIVO').subscribe(
      result => {   
        if (result.length == 0){
          this.mostrarToast("No se encontraron contratos asociados a este usuario.");
          return;
        }    
        if (this.userDataProvider.getTipoAcceso() == 5){
          this.contratos = result.filter(cto => cto.ctNumeroContrato == this.userDataProvider.getContrato());
        } else {
          this.contratos= result;
        } 
        this.contratoSelect = new Contrato();

        if (this.editar){
          var pos = this.funcionesProvider.arrayObjectIndexOf(this.contratos, this.servicio.ContratoId, 'IdContrato');
          if(pos >=0){                        
              this.contratoSelect = this.contratos[pos];
              this.buscarContrato('COMBO', false);                    
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  setDatosServicio(): void {               
    var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.TipoServicio, this.servicio.TipoServicidoId, 'csTipoServicioId');        
    if(pos >=0){                            
        this.servicio.Tipo = this.contrato.TipoServicio[pos];
        this.tipoServicioCheck();
    }                
  }

  buscarContrato(opcion:string, modifarServicio:boolean ): void {
    if (modifarServicio){
      this.servicio.ContratoId = 0;
    }

    let numero = "";

    if(opcion ==="COMBO"){
      numero = this.contratoSelect.ctNumeroContrato;
    }else {
      if (this.servicio.NumeroContrato == ""){
        this.mostrarToast("Estimado usuario(a), por favor ingrese el número de contrato.");
        return;
      }
      numero = this.servicio.NumeroContrato;
    }

    this.mostrarToast("Consultando información... ", 1000);

    this.contratoProvider.getByNumeroContrato(numero).subscribe(
      result => {      
        
        if (result != null){
          this.contrato.Nombre = result.ctContratante;            
          this.contrato.FormaPago = JSON.parse(result.ctFormaPago) 
          this.contrato.TipoServicio = result.TipoServicio;
          this.contrato.Plantilla = result.Plantilla;  
          
          if(this.contrato.TipoServicio.length === 0){
            this.mostrarToast('No se encontraron servicios asociados a este contrato.');
          }

          if(this.editar){ 
            this.setDatosServicio(); 
          }

          if(modifarServicio){
            
            this.servicio.ContratoId = result.IdContrato;
            this.servicio.Nit = result.ctNitCliente;
            this.servicio.Telefono =  result.ctTelefono;
            this.servicio.NumeroContrato = this.contratoSelect.ctNumeroContrato;
            this.servicio.Responsable = this.contrato.Nombre;
            if( this.userDataProvider.getTipoAcceso() === 5){
              this.servicio.Responsable = this.userDataProvider.getNombre();
            }           
          }
          
        }  else {
          this.mostrarToast("Número de contrato no existe.");
        }
         
      },
      error => {
        this.mostrarToast(error);
        console.log(<any>error);
      }
    );
  }

  tipoServicioCheck():void {

    if(this.servicio.Tipo.csTipoServicioId != 3){                             
      setTimeout(() => {
        var div1 = document.getElementById('map_canvas');                
        div1.classList.remove('hidden');
        div1.classList.add('visible');     
        this.initMapa();
        this.initAutocompleteDestino();   
      },500);                
    }
    
    this.tituloPlantilla = "Plantillas " + this.servicio.Tipo.csDescripcion;
    if(this.contrato.Plantilla.length ===0){
        this.mostrarToast("No se definieron plantillas para este contrato.");
        return;
    }

    var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.Plantilla,this.servicio.Tipo.csTipoServicioId, 'pcTipoServicio');

    if(pos >=0){
      this.editModoServicio = true;
      this.editTipoVehiculo = true;
      this.servicio.ModoServicio = "PROGRAMADO";
      this.plantilla = this.contrato.Plantilla[pos];           
      if(this.servicio.Tipo.csTipoServicioId == 1){              
        this.buscarValorParada();
        this.getTipoVehiculo(this.plantilla.plCodigo, this.servicio.Tipo.csTipoServicioId );
        this.editTipoVehiculo = false;
        this.editModoServicio = false;
      } else if(this.servicio.Tipo.csTipoServicioId == 2) {                                
          this.getTipoVehiculo(this.plantilla.plCodigo, this.servicio.Tipo.csTipoServicioId );
          this.editTipoVehiculo = false;
          this.editModoServicio = false;
      } else if(this.servicio.Tipo.csTipoServicioId == 3){ //ruta 
          this.getRutas(this.plantilla.plCodigo);
          this.getTiposVehiculos();
      }else { //traslado                
          this.getTraslados(this.plantilla.plCodigo);
          this.getTiposVehiculos();
      }
    }       
  }

  consultarPrecio (): void {
    switch (this.servicio.Tipo.csTipoServicioId) {
      case 1:
          this.buscarTransfert();
          break;
      case 2:
          this.buscarDisponibilidad();
          break;
      case 3:
          break;
      case 4:
          break;
      default:
          this.mostrarToast("Seleccione un tipo de servicio.");
          break;
    }
  }

  buscarTransfert() : void {
    if(this.tipoSelect.tvCodigo == null){
        this.mostrarToast('Seleccione el tipo de vehículo.');
        return;
    }

    if(this.servicio.ZonaOrigen == null){
        this.mostrarToast('Por favor ingrese la dirección de origen correctamente.');
        return;
    }

    if(this.servicio.ZonaDestino === null){
        this.mostrarToast('Por favor ingrese la dirección de destino correctamente.');
        return;
    }

    this.servicio.Valor = 0;
    this.servicio.ValorCliente = 0;

    this.contratoProvider.getTransfert(this.plantilla.plCodigo, this.tipoSelect.tvCodigo,
      this.servicio.ZonaOrigen, this.servicio.ZonaDestino).subscribe(
      result => {    
        if (result != null){
          this.servicio.Valor = result.tfValor;
          this.servicio.ValorCliente = result.tfValorCliente;
          this.servicio.ValorTotal = parseInt(result.tfValorCliente);
          this.servicio.Codigo = result.tfCodigo;
          this.servicio.DetallePlantillaId = result.tfCodigo;
          this.mostrarToast("Valor del Servicio. $ "+ this.servicio.ValorCliente) 
          this.servicio.ValorTotal= this.servicio.ValorCliente +  this.subTotal;
        } else {
          this.mostrarToast("Estimado Usuario(a), no se encontró el precio con estos " +
                        "parametros de ubicación y tipo de vehículo");
        } 
          
      },
      error => {
        console.log(<any>error);
        this.mostrarToast("Error al buscar precios ");
      }
    );
  }

  buscarDisponibilidad() : void {
    if(this.tipoSelect.tvCodigo == null){
        this.mostrarToast('Seleccione el tipo de vehículo.');
        return;
    }
  
    this.servicio.Valor = 0;
    this.servicio.ValorCliente = 0;

    this.contratoProvider.getDisponibilidad(this.plantilla.plCodigo, this.tipoSelect.tvCodigo).subscribe(
      result => {    
        if (result != null){
          this.servicio.Valor = result.dpValorHora;
          this.servicio.ValorCliente = result.dpValorCliente;
          this.servicio.ValorTotal = parseInt(result.dpValorCliente);
          this.servicio.Codigo = result.dpCodigo;
          this.servicio.DetallePlantillaId = result.dpCodigo;
          this.mostrarToast("Valor del Servicio. $ "+ this.servicio.ValorCliente) 

        } else {
          this.mostrarToast("Estimado Usuario(a), no se encontró el precio con los " +
                            "parametros ingresados");
        } 
      },
      error => {
        console.log(<any>error);
        this.mostrarToast("Error al buscar precios disponibilidad.");
      }
    );
  }

  cambiarPrecio(): void {
    this.servicio.Valor = 0;
    this.servicio.ValorCliente = 0;
    this.servicio.ValorTotal= this.servicio.ValorCliente +  this.subTotal;
  }

  validarServicio(frm : NgForm): void {
        
    if(frm.invalid){
      this.mostrarToast('Por favor ingrese los datos requeridos (*).');
      return;
    } 

    if (this.contratoSelect.IdContrato == null){
      this.mostrarToast("Por favor seleccionar el contrato");
      return;
    }

    this.aceptarCondicion = false;
    if(this.servicio.Tipo.csTipoServicioId == null){
      this.mostrarToast('Seleccione el tipo de servicio.');
      return;
    }
    if(this.tipoSelect.tvCodigo == null){
      this.mostrarToast('Seleccione el tipo de vehículo.');
      return;
    }
    
    if(this.servicio.NumPasajeros == 0){
        this.mostrarToast('Seleccione el número de pasajeros.');
        return;
    }
    
    if(this.servicio.NumPasajeros > this.tipoSelect.tvNumPasajero){
        this.mostrarToast('Estimado Usuario(a), el número de pasajeros supera el limite permitido'+
                " para el tipo de vehículo seleccionado ("+this.tipoSelect.tvDescripcion + ")",7000);
        return;
    }
    if(this.servicio.ValorCliente == 0){
        this.mostrarToast( "Valor del servicio no puede ser cero(0)."+
                        " Por favor hacer click en consultar precio");
        return;
    }
    
    if(this.servicio.Contactos.length === 0){
        this.mostrarToast( "Por favor ingrese al menos un responsable del servicio.");
        return;
    }
    
    this.servicio.Responsable = this.servicio.Contactos[0].scNombre;
    this.servicio.Telefono = this.servicio.Contactos[0].scTelefono;
    this.servicio.Nota = this.servicio.Contactos[0].scNota;
    
    if(this.servicio.FormaPago ===""){
        this.mostrarToast( "Estimado Usuario(a), por favor seleccione la forma de Pago.");
        return;
    }
    
    switch (this.servicio.Tipo.csTipoServicioId) {
        case 1:
        case 4:
            
            if(this.servicio.LatOrigen == "" || this.servicio.LngOrigen ===""){
                this.mostrarToast( "Estimado Usuario(a), por favor seleccione la posicion de Origen.");
                return;
            }
            
            if(this.servicio.DireccionOrigen===""){
                this.mostrarToast( "Estimado Usuario(a), por favor ingrese la dirección  de Origen.");
                return;
            }
            
            
            if(this.servicio.LatDestino == "" || this.servicio.LngDestino ===""){
                this.mostrarToast( "Estimado Usuario(a), por favor seleccione la posicion de Destino.");
                return;
            }
            
            if(!this.servicio.DireccionDestino || this.servicio.DireccionDestino===""){
                this.mostrarToast( "Estimado Usuario(a), por favor ingrese la dirección  de Destino.");
                return;
            }                             

            break;
            
        case 2: 
            
            if(this.servicio.LatOrigen === "" || this.servicio.LngOrigen ===""){
                this.mostrarToast( "Estimado Usuario(a), por favor seleccione la posicion de Origen.");
                return;
            }
            
            if(this.servicio.DireccionOrigen ==""){
                this.mostrarToast( "Estimado Usuario(a), por favor ingrese la dirección  de Origen.");
                return;
            }
                            
            break;
            
         case 3: 
            if(this.rutaSelect == null){
                this.mostrarToast( "Estimado Usuario(a), por favor seleccione la ruta.");
                return;
            }
            break;

        default:

            break;
    }
       
    if(this.editar){
      this.servicio.Parada = this.servicio.Paradas.length > 0 ? "SI" : "NO";
      this.actualizarServicio();
    } else {       
      this.aceptarCondicion = true; 
      this.mostrarConfirmacion();
    }
  };

  guardarServicio(): void { 
        
    if(!this.aceptarCondicion){
        this.mostrarToast("Estimado Usuario(a), por favor acepte las condiciones de servicio.");
        return;
    }
    
      
    this.servicio.TipoVehiculoId = this.tipoSelect.tvCodigo;
    this.servicio.DescVehiculo = this.tipoSelect.tvDescripcion;
    this.servicio.NumeroContrato = this.contratoSelect.ctNumeroContrato;
    this.servicio.TipoServicidoId = this.servicio.Tipo.csTipoServicioId;
    this.servicio.PlantillaId= this.plantilla.plCodigo;        
    this.servicio.Parada = this.servicio.Paradas.length > 0 ? "SI" : "NO";                
    
    this.servicioProvider.post(this.servicio).subscribe(
      result => {        
        this.contratoSelect = new Contrato();
        this.initDatos();
        this.mostrarToast(result.message);
      },
      error => {
        this.mostrarToast('¡Error!' + error, 5000);
        console.log(JSON.stringify(error));
      }
    );
  };

  convertirHora(fecha: string) : void {
    let hora = moment(fecha, "h:mm a");
    this.servicio.Hora = hora.format("h:mm a");
  }
  
  consultarContactos(id : number) : void {
    this.servicioProvider.getContactos(id).subscribe(
      result => {        
        this.servicio.Contactos = result;  
      },
      error => {
        this.mostrarToast("Error al consultar servicio.");
        console.log(<any>error);
      }
    );
  }

  actualizarServicio(): void{
    this.mostrarToast('Actualizando servicio, espere por favor....', 3000);

    this.servicioProvider.put(this.servicio.IdServicio, this.servicio).subscribe(
      result => {        
        this.mostrarToast(result.message);
        this.contratoSelect = new Contrato();
      },
      error => {
        this.mostrarToast(error.data);
        console.log(<any>error);
      }
    );
  };



  //FUNCIONES DE CONTACTO
  agregarContacto(): void {
    if (this.contacto.scNombre == null || this.contacto.scNombre == ""){
      this.mostrarToast("Por favor ingrese el nombre del Responsable.");
      return;
    }

    if (this.contacto.scTelefono == null || this.contacto.scTelefono == ""){
      this.mostrarToast("Por favor ingrese el número de teléfono.");
      return;
    }

    if(this.editar){
            
      this.contacto.scIdServicio = this.servicio.IdServicio;
      this.servicioProvider.agregarContacto(this.contacto).subscribe(
        result => {        
           this.consultarContactos(this.servicio.IdServicio);
           this.mostrarToast("Contacto guardado correctamente.");
        },
        error => {
          this.mostrarToast("Error al guardar contacto.");
          console.log(<any>error);
        }
      );                  
    }else {
      this.servicio.Contactos.push(this.contacto);
    }
    this.contacto = new Contacto();
  }

  quitarContacto(idx: number): void {
    this.servicio.Contactos.splice(idx,1);
  }

  eliminarContacto(item:Contacto): void {
    this.contratoProvider.getByCliente(this.servicio.ClienteId, 'ACTIVO').subscribe(
      result => {      
        this.mostrarToast("Contacto eliminado correctamente.");  
        this.consultarContactos(item.scIdServicio); 
      },
      error => {
        this.mostrarToast("Error al eliminar contacto.");
        console.log(<any>error);
      }
    );
  };


  //FUNCIONES DE PARADAS
  agregarParada() : void {
    if (this.parada.prDireccion == null || this.parada.prDireccion == ""){
      this.mostrarToast("Por favor ingrese la dirección de parada.");
      return;
    }
    if (this.servicio.ValorParadaCliente == 0){
      this.mostrarToast("No se ha definido el valor de la parada para esta plantilla.");
      return;
    }

    this.parada.prLatiud = "0";
    this.parada.prLongitud  = "0";                  
    this.parada.prValor = this.servicio.ValorParadaProveedor;
    this.parada.prValorCliente = this.servicio.ValorParadaCliente;
    this.parada.prFecha = this.servicio.FechaServicio;

    if(this.editar){
      this.parada.prServicio = this.servicio.IdServicio;
      this.servicioProvider.agregarParada(this.parada).subscribe(
        result => {        
          this.consultarParadas(this.servicio.IdServicio);                
          this.mostrarToast("Parada guardada correctamente.");
        },
        error => {
          this.mostrarToast("Error al guardar parada.");
          console.log(<any>error);
        } 
      );                  
    }else {                
      this.servicio.Paradas.push(this.parada);
      this.totalParada();
    }
    this.parada = new Parada();
  }

  quitarParada(idx: number): void {
    this.servicio.Paradas.splice(idx, 1);
    this.totalParada();
  }

  consultarParadas (idServicio: number){
    this.servicioProvider.getParadas(idServicio).subscribe(
      result => {        
        this.servicio.Paradas = result;
        this.totalParada();
      },
      error => {
        this.mostrarToast("Error al consultar paradas.");
        console.log(<any>error);
      } 
    );
  }

  eliminarParada (item: Parada): void{
    this.servicioProvider.eliminarParada(item.IdParada).subscribe(
      result => {        
        this.mostrarToast("Parada eliminada correctamente."); 
        this.consultarParadas(item.prServicio);
      },
      error => {
        this.mostrarToast("Error al eliminar parada.");
        console.log(<any>error);
      } 
    );   
  };

  totalParada(): void{
    let total = 0;
    let totalProveedor = 0;
    this.servicio.Paradas.forEach(element => {
      total += element.prValorCliente;
      totalProveedor += element.prValor;
    });
    this.subTotal = total;
    this.servicio.ValorParadas = totalProveedor;
    this.servicio.ValorTotal =  this.subTotal + this.servicio.ValorCliente;
  }

  cambiarPrecioRuta() : void{
   
    if(this.rutaSelect == null){
        return;
    }
    
    this.servicio.ValorCliente = this.rutaSelect.rtValorCliente;
    this.servicio.Valor = this.rutaSelect.rtValor;
    this.servicio.DetallePlantillaId = this.rutaSelect.rtCodigo;
    this.servicio.DireccionOrigen = this.rutaSelect.rtNombre;
    this.servicio.DireccionDestino = this.rutaSelect.rtDescripcion;
    
    if(this.asignacion.Ruta =="doble"){
        this.servicio.ValorCliente += this.servicio.ValorCliente;
        this.servicio.Valor += this.servicio.Valor;
    };
    
    this.mostrarToast("Valor del Servicio. $ " + this.servicio.ValorCliente);

    this.servicio.ValorTotal = this.servicio.ValorCliente;
    
    var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.TipoVehiculo, this.rutaSelect.rtTipoVehiculo, 'tvCodigo');        
    if(pos >=0){                            
        this.tipoSelect = this.contrato.TipoVehiculo[pos];
    }  
  };   

  cambiarPrecioTraslado =  function (){
    if(this.trasladoSelect == null){
        return;
    }
    
    this.servicio.ValorCliente = parseFloat(this.trasladoSelect.tlValorCliente);
    this.servicio.Valor = parseFloat(this.trasladoSelect.tlValor);
    this.servicio.DetallePlantillaId = this.trasladoSelect.tlCodigo;
    
    this.mostrarToast("Valor del Servicio. $ "+ this.servicio.ValorCliente);
    
    var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.TipoVehiculo, this.trasladoSelect.tlTipoVehiculo, 'tvCodigo');
    console.log(pos);
    if(pos >=0){                            
        this.tipoSelect = this.contrato.TipoVehiculo[pos];
    }  
  };   

  // Validar Datos por pestaña
  onOpcionChange(): void{
    this.btnSiguiente = false;
    this.btnAnterior = false;


    switch (this.opcionTab){

      //Contrato
      case "1":
        this.btnAnterior = true;
        break;

      // TipoServicio
      case "2":
        if (this.contratoSelect.IdContrato == null){
          this.mostrarToast("Por favor seleccionar el contrato");
          this.opcionTab = "1";
          return;
        }
        break;

      // Direccion
      case "3":
      
        if(this.servicio.Tipo.csTipoServicioId == 0){
          this.mostrarToast("Por favor seleccionar el tipo de servicio.");
          this.opcionTab = "2";
          return ;
        }
        break;

      //Responsable
      case "4":
        
      break;

      case "5":
        
       break;

      case "6":
        this.btnSiguiente = true;
        break;

      default :
        console.log("entre por aca");
       break;
    }
  }

  moverTabSiguiente(){
    let tab = parseInt(this.opcionTab) + 1 ;

    if (tab == 5 && this.servicio.Tipo.csTipoServicioId != 1){
      this.opcionTab = "6";
      return;
    }

    if (tab == 3 && this.servicio.Tipo.csTipoServicioId  == 3){
      this.opcionTab = "4";
      return;
    }

    this.opcionTab = tab.toString();
  }

  moverTabAnterior(){
    let tab = parseInt(this.opcionTab) - 1 ;
    
    if (tab == 5 && this.servicio.Tipo.csTipoServicioId != 1){
      this.opcionTab = "4";
      return;
    }

    if (tab == 3 && this.servicio.Tipo.csTipoServicioId  == 3){
      this.opcionTab = "2";
      return;
    }
    
    this.opcionTab = tab.toString();
  }

  mostrarConfirmacion() {
    const confirm = this.alertCtrl.create({
      title: 'Confirmación de Servicio.',
      message: 'Esta seguro que desea solicitar este servicio, por valor de $ '+ this.servicio.ValorTotal
          + ' .  Recuerde que al dar click en aceptar, acepta nuestras condiciones de servicio. ',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.mostrarToast("Espere por favor .. procesando información", 5000);
            this.guardarServicio();
          }
        }
      ]
    });
    confirm.present();
  }

}


