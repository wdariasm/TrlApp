export class Contrato {
    IdContrato: number;
    ctClienteId : number;
    ctNitCliente : string;
    ctContratante: string;
    ctTelefono : string;
    ctFechaInicio : Date;
    ctFechaFinal : Date;
    ctObjeto : string;
    ctNumeroContrato : string;
    ctRecorridos : string;
    ctDuracion : string;
    ctNumVehiculos : string;
    ctUsuarReg : string;
    ctFechaReg : Date;
    ctTipoContrato : string;
    ctEstado : string;
    ctFormaPago : string;
    constructor (){
        this.IdContrato =  null;
    }
}