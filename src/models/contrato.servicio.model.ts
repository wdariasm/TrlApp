import { ContratoTipoServicio } from '../models/contrato.tiposervicio.model'

export class ContratoPlantilla{
    pcCodigo : number;
    pcContratoId : number; 
    pcPlantillaId : number;
    pcTipoServicio : string;
    pcEstado: string;
}

export class ContratoServicio {
    TipoServicio : ContratoTipoServicio[];
    Plantilla: ContratoPlantilla[];
    TipoVehiculo : any;
    FechaInicio : Date;
    FechaFin : Date;
    Estado : string;
    Nombre: string;
    FormaPago : string[];

    constructor (){
        this.FormaPago = [];
        this.Nombre = "";
        this.Estado = "";
        this.Plantilla = [];
        this.TipoServicio = [];
    }
}

