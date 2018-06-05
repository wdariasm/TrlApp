import { ContratoTipoServicio } from '../models/contrato.tiposervicio.model'
import { TipoVehiculo } from '../models/tipo.vehiculo.model';

export class ContratoPlantilla{
    pcCodigo : number;
    pcContratoId : number; 
    pcPlantillaId : number;
    pcTipoServicio : string;
    pcEstado: string;
    plCodigo : number;
    plDescripcion : string;
}

export class ContratoServicio {
    TipoServicio : ContratoTipoServicio[];
    Plantilla: ContratoPlantilla[];
    TipoVehiculo : TipoVehiculo[];
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
        this.TipoVehiculo = [];
    }
}

