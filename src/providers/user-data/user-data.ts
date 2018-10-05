import { Injectable } from '@angular/core';

/*
  Generated class for the UserDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserDataProvider {

  private IdUsuario : number;
  private Login : string;
  private Nombre:  string;
  private Estado : string;
  private ClienteId : number;
  private TipoAcceso : number;
  private ValidarClave : string;
  private Contrato : string;
  private Email : string;
  private _token : string;
 
  constructor() {
    this._token = localStorage.getItem("trl_token");
  }

  public SetDatosToken(token:string){

    //Guardar Token
    localStorage.setItem("trl_token", token);
    this._token = token;

    let user : any = {};

    // Obtener datos de usuario desde el  token
    if (typeof token !== 'undefined') {
        var encoded = token.split('.')[1];
        user = JSON.parse(window.atob(encoded)).user;
        localStorage.setItem("usuario","");
        if (user != null){
          localStorage.setItem("usuario",btoa( JSON.stringify(user)));
          this.IdUsuario = user.IdUsuario;
          this.Nombre = user.Nombre;
          this.TipoAcceso = user.TipoAcceso;
        }
    }
  }

  public SetToken(token:string){
    //Guardar Token
    localStorage.setItem("trl_token", token);
    this._token = token;
  }

  public getToken(){
    return this._token;
  }

  public SetDatos(user: any){
    localStorage.setItem("usuario","");
    if (user != null){
      localStorage.setItem("usuario",btoa( JSON.stringify(user)));
      this.IdUsuario = user.IdUsuario;
      this.Nombre = user.Nombre;
      this.TipoAcceso = user.TipoAcceso;
      this.Login = user.Login;
      this.Email = user.Email;
      this.ClienteId = user.ClienteId;
      this.ValidarClave = user.ValidarClave;
      this.Estado = user.Estado;
      this.Contrato  = user.Contrato;
    }
  }

  public RecuperarDatos(){
    let user =JSON.parse(atob(localStorage.getItem("usuario")));
    this.SetDatos(user);
  }

  public getIdUsuario(){
    return this.IdUsuario;
  }

  public getLogin(){
    return this.Login;
  }

  public getNombre(){
    return this.Nombre;
  }

  public getEmail(){
    return this.Email;
  }

  public getTipoAcceso(){
    return this.TipoAcceso;
  }

  public getContrato(){
    return this.Contrato;
  }

  public getIdCliente(){
    return this.ClienteId;
  }

  public getEstado(){
    return this.Estado;
  }

  public getValidarClave(){
    return this.ValidarClave;
  }
  
}
