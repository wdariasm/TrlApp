export class Cliente{
    IdCliente : number;
    Identificacion : string;
    Nombres : string;
    Direccion : string;
    MovilPpal : string;
    MovilDos : string;
    MovilTres : string;
    Correo : string;
    Estado : string;
    DigitoVerificacion :  string;
    TipoDocumento : string;
    TipoPersona : string;

    constructor (){
        this.Identificacion = "";
        this.Nombres = "";
        this.DigitoVerificacion = "";
        this.Direccion = "";
        this.MovilDos = "";
        this.MovilPpal = "";
        this.MovilTres = "";
        this.TipoDocumento = "";
        this.TipoPersona = "";
        this.Correo = "";
        this.IdCliente = 0;
    }
}

export class TipoDocumento{
    tdCodigo : string;
    tdDescripcion : string;

    constructor(){
        this.tdCodigo = "";
        this.tdDescripcion = "";
    }
}