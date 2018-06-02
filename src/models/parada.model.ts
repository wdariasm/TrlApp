export class Parada {
    prDireccion : string;
    prLatiud : string;
    prLongitud : string;
    prValor : number;
    prFecha : Date;
    prValorCliente : number;

    constructor (){
        this.prDireccion = "";
        this.prLatiud = "";
        this.prLongitud = "";
        this.prValor = 0;
        this.prValorCliente = 0;
    }
}