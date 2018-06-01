export class Asignacion{
    Manual : boolean;
    Marcador : string;
    Ruta : string;

    constructor(public manual: boolean, public  marcador: string, public ruta:string) {
       this.Manual = manual;
       this.Marcador = marcador;
       this.Ruta = ruta;
    }
  }