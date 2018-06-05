import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import { Servicio  } from '../../models/servicio.model';
import { Asignacion }  from '../../models/asignacion.model'; 
import { Traslado } from '../../models/traslado.model';
import { TipoVehiculo } from '../../models/tipo.vehiculo.model';
import { Contacto } from '../../models/contacto.model';
import { Parada } from '../../models/parada.model';
import { ContratoServicio, ContratoPlantilla } from '../../models/contrato.servicio.model';
import { Contrato } from '../../models/contrato.model';

import { ContratoProvider } from '../../providers/contrato/contrato';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';



@IonicPage()
@Component({
  selector: 'page-servicio',
  templateUrl: 'servicio.html',
})
export class ServicioPage {

  servicio : Servicio;
  opcion : string = "Contrato"; // Opcion de tab 
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
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController, public contratoProvider: ContratoProvider,
              public funcionesProvider: FuncionesComunesProvider) {
    
    this.asignacion = new Asignacion(false, "Origen", "ida");
    this.trasladoSelect  = new Traslado();
    this.tipoSelect = new TipoVehiculo();
    this.servicio = new Servicio();
    this.contacto =  new Contacto();
    this.parada = new Parada();
    this.plantilla = new ContratoPlantilla();
    
    this.servicio.ModoServicio = "PROGRAMADO";
    this.servicio.ClienteId = 1;
    this.contrato = new ContratoServicio();

  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicioPage');
    this.getContratos();
  }

  mostrarToast(mensaje : string, duracion: number = 3000) {
    const toast = this.toastCtrl.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  iniciarMapaZ(): void {
    console.log("Iniciando mapa");
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

  getContratos(): void {
    this.contratoProvider.getByCliente(this.servicio.ClienteId, 'ACTIVO').subscribe(
      result => {        
          this.contratos= result;
      },
      error => {
        console.log(<any>error);
      }
    );
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
        console.log(result); 
        if (result != null){
          
          this.contrato.Nombre = result.ctContratante;            
          this.contrato.FormaPago = JSON.parse(result.ctFormaPago) 
        console.log(this.contrato.FormaPago);
          this.contrato.TipoServicio = result.TipoServicio;
          this.contrato.Plantilla = result.Plantilla;  
          
          if(this.contrato.TipoServicio.length === 0){
            this.mostrarToast('No se encontraron servicios asociados a este contrato.');
          }

          if(this.editar){ 
            //setDatosServicio(); 
          }

          if(modifarServicio){
            
            this.servicio.ContratoId = result.IdContrato;
            this.servicio.Nit = result.ctNitCliente;
            this.servicio.Telefono =  result.ctTelefono;
            this.servicio.NumeroContrato = this.contratoSelect.ctNumeroContrato;
            this.servicio.Responsable = this.contrato.Nombre;
            /*if( parseInt(this.$parent.Login.TipoAcceso) === 5){
                this.Servicio.Responsable = this.$parent.Login.Nombre;
            }       */            
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

  tipoServicioCheck():void{
    if(this.servicio.Tipo.csTipoServicioId != 3){                               
      var div1 = document.getElementById('dvMapaServicio');                
      div1.classList.remove('hidden');
      div1.classList.add('visible');                                  
     // setTimeout(function (){ this.iniciarMapaZ();},200);                
  }

  this.tituloPlantilla = "Plantillas " + this.servicio.Tipo.csDescripcion;
  if(this.contrato.Plantilla.length ===0){
      this.mostrarToast("No se definieron plantillas para este contrato.");
      return;
  }

  var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.Plantilla,this.servicio.Tipo.csTipoServicioId, 'pcTipoServicio');
  console.log("posicion ", pos);
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
          //getRutas(this.plantilla.plCodigo);
          this.getTiposVehiculos();
      }else { //traslado                
          //getTraslados(this.plantilla.plCodigo);
          this.getTiposVehiculos();
      }
    }       
  }


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

    this.servicio.Contactos.push(this.contacto);

    this.contacto = new Contacto();

  }

  quitarContacto(idx: number): void {
    this.servicio.Contactos.splice(idx,1);
  }


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

    this.servicio.Paradas.push(this.parada);
    this.totalParada();
    this.parada = new Parada();
  }

  quitarParada(idx: number): void {
    this.servicio.Paradas.splice(idx, 1);
    this.totalParada();
  }

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

  

}


