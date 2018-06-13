export class Usuario {
    IdUsuario : number;
    Login : string;
    Nombre:  string;
    Estado : string;
    Modulo : string;
    ClienteId : number;
    PersonaId : number;
    ConductorId : number;
    TipoAcceso : number;
    ValidarClave : string;
    Contrato : string;
    Email : string;

    constructor () {
        this.ClienteId = 1;
    }

}