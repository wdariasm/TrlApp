import  {Parada } from './parada.model';
import { Contacto } from './contacto.model';
import { ContratoTipoServicio } from './contrato.tiposervicio.model'

export class Servicio {
    IdServicio: number;
    ClienteId: number;
    DireccionOrigen : string;
    DireccionDestino : string;
    ContratoId : number;
    NumeroContrato:string;
    Nit : string;
    Telefono : string;
    Tipo : ContratoTipoServicio;
    Responsable : string;
    FechaServicio: string;
    Hora: string;
    Valor : number;
    ValorCliente : number;
    NumHoras : number;
    NumPasajeros : number;
    ZonaOrigen :number;
    ZonaDestino : number;
    LatOrigen :string;
    LngOrigen: string;
    LatDestino : string;
    LngDestino : string;
    UserReg : string;
    FormaPago :string;
    EnviarEmail : string;
    ParEmail : string;
    Paradas : Parada[];
    Parada : string;
    ValorTotal :number;
    Nota :string;
    ModoServicio : string;
    Contactos : Contacto[];
    ValorParadaProveedor : number;
    ValorParadaCliente : number;
    ValorParadas : number;
    DetallePlantillaId : number;
    TipoVehiculoId : number;
    TipoServicidoId : number;
    Codigo : number;
    DescVehiculo : string;
    PlantillaId : number;

    constructor(){
        this.Tipo = new ContratoTipoServicio();
        this.Contactos = [];
        this.ValorParadaCliente =0;
        this.ValorParadaProveedor = 0;
        this.NumPasajeros = 0;
        //this.FechaServicio = new Date();
        this.Paradas = [];
        this.NumeroContrato = "";
        this.LatOrigen = "";
        this.LngOrigen = "";
        this.DireccionOrigen = "";
        this.LatDestino = "";
        this.LngDestino = "";
        this.ValorCliente =0;
        this.ValorTotal = 0;
        this.Valor = 0;
        this.NumHoras = 0;
        this.UserReg = "Admin";
        this.EnviarEmail = "SI";
    }
}

export class Coordenada {
    Latitud : number;
    Longitud : number;
    constructor () {
        this.Latitud = 4.7081865;
        this.Longitud = -74.0949768;
    }
}
