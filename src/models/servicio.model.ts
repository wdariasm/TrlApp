import {Parada} from './parada.model';
import {Contacto} from './contacto.model';

export class Servicio {
    IdServicio: number;
    ClienteId: number;
    DireccionOrigen : string;
    DireccionDestino : string;
    ContratoId : number;
    NumeroContrato:string;
    Nit : string;
    Telefono : string;
    Tipo : any;
    Responsable : string;
    FechaServicio: Date;
    Hora: Date;
    Valor : number;
    ValorCliente : number;
    NumHoras : number;
    NumPasajeros : string;
    ZonaOrigen :string;
    ZonaDestino : string;
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
    DetallePlantillaId : 0 
}