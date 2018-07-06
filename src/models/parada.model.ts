export class Parada {
    IdParada : number;
    prDireccion : string;
    prLatiud : string;
    prLongitud : string;
    prValor : number;
    prFecha : string;
    prValorCliente : number;
    prServicio : number;

    constructor (){
        this.prDireccion = "";
        this.prLatiud = "";
        this.prLongitud = "";
        this.prValor = 0;
        this.prValorCliente = 0;
    }
}