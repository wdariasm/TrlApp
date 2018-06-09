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
import { Ruta } from '../../models/ruta.model';
import { Usuario } from '../../models/usuario.model';

import { ContratoProvider } from '../../providers/contrato/contrato';
import { FuncionesComunesProvider } from '../../providers/funciones-comunes/funciones-comunes';
import { ServicioProvider } from '../../providers/servicio/servicio';

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
  lstRutas : Ruta [];
  rutaSelect : Ruta;
  lstTraslados : Traslado [];
  aceptarCondicion : boolean;
  enviandoInformacion : boolean;
  usuario : Usuario;  
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public toastCtrl: ToastController, public contratoProvider: ContratoProvider,
              public funcionesProvider: FuncionesComunesProvider, 
              public servicioProvider : ServicioProvider) {
    
    this.initDatos();
  }
  

  ionViewDidLoad() {
    this.getContratos();
  }

  initDatos(){
    this.asignacion = new Asignacion(false, "Origen", "ida");
    this.trasladoSelect  = new Traslado();
    this.tipoSelect = new TipoVehiculo();
    this.servicio = new Servicio();
    this.contacto =  new Contacto();
    this.parada = new Parada();
    this.plantilla = new ContratoPlantilla();
    this.usuario = new Usuario();
    
    this.servicio.ModoServicio = "PROGRAMADO";
    this.servicio.ClienteId = this.usuario.ClienteId;
    this.servicio.UserReg = this.usuario.Login;
    this.contrato = new ContratoServicio();
    this.lstRutas = [];
    this.lstTraslados = [];
    this.rutaSelect = new Ruta();
    this.editar = false;
    this.editTipoVehiculo =true;
    this.editModoServicio = true;
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
        if (this.usuario.TipoAcceso == 5){
          this.contratos = result.filter(cto => cto.ctNumeroContrato == this.usuario.Contrato);
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
            if( this.usuario.TipoAcceso === 5){
              this.servicio.Responsable = this.usuario.Nombre;
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

  validarServicio(): void {
        
   /* if(!this.frmServicio.$valid){
        toaster.pop('error','¡Error!', 'Por favor ingrese los datos requeridos (*).');
        return;
    } */
    
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
            
            
            if(this.servicio.LatDestino || this.servicio.LngDestino ===""){
                this.mostrarToast( "Estimado Usuario(a), por favor seleccione la posicion de Destino.");
                return;
            }
            
            if(!this.servicio.DireccionDestino || this.servicio.DireccionDestino===""){
                this.mostrarToast( "Estimado Usuario(a), por favor ingrese la dirección  de Destino.");
                return;
            }                             

            break;
            
        case 2: 
            
            if(this.servicio.LatOrigen || this.servicio.LngOrigen ===""){
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
      
    }
  };

  guardarServicio(): void { 
        
    if(!this.aceptarCondicion){
        this.mostrarToast("Estimado Usuario(a), por favor acepte las condiciones de servicio.");
        return;
    }
    
    this.enviandoInformacion = true;
    
    this.servicio.TipoVehiculoId = this.tipoSelect.tvCodigo;
    this.servicio.DescVehiculo = this.tipoSelect.tvDescripcion;
    this.servicio.NumeroContrato = this.contratoSelect.ctNumeroContrato;
    this.servicio.TipoServicidoId = this.servicio.Tipo.csTipoServicioId;
    this.servicio.PlantillaId= this.plantilla.plCodigo;        
    this.servicio.Parada = this.servicio.Paradas.length > 0 ? "SI" : "NO";                
    
    this.servicioProvider.post(this.servicio).subscribe(
      result => {        
        this.enviandoInformacion = false;
        this.contratoSelect = new Contrato();
        this.mostrarToast(result.message);
      },
      error => {
        this.mostrarToast('¡Error!' + error.data, 5000);
        console.log(<any>error);
      }
    );
  };

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
    this.mostrarToast('Actualizando servicio ....', 2000);

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
    
    var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.TipoVehiculo, this.rutaSelect.rtTipoVehiculo, 'tvCodigo');        
    if(pos >=0){                            
        this.tipoSelect = this.contrato.TipoVehiculo[pos];
    }  
  };   

  cambiarPrecioTraslado =  function (){
    if(this.TrasladoSelect == null){
        return;
    }
    
    this.servicio.ValorCliente = parseFloat(this.TrasladoSelect.tlValorCliente);
    this.servicio.Valor = parseFloat(this.TrasladoSelect.tlValor);
    this.servicio.DetallePlantillaId = this.TrasladoSelect.tlCodigo;
    
    this.mostrarToast("Valor del Servicio. $ "+ this.servicio.ValorCliente);
    
    var pos = this.funcionesProvider.arrayObjectIndexOf(this.contrato.TipoVehiculo, this.trasladoSelect.tlTipoVehiculo, 'tvCodigo');
    if(pos >=0){                            
        this.tipoSelect = this.contrato.TipoVehiculo[pos];
    }  
  };   

}


