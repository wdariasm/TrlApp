export class ContratoTipoServicio{
    csCodigo : number;
    csContratoId : number;
    csTipoServicioId : number;
    csDescripcion : string;
    csPlantilla : string;
    csValor : number;
    
    constructor (){
        this.csValor = 0;
        this.csPlantilla = "NO";
        this.csTipoServicioId = 0;
    }
}