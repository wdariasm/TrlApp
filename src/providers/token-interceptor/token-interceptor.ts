import {  HttpRequest, 
          HttpHandler,
          HttpEvent,
          HttpInterceptor  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from  'rxjs/Observable';
import { UserDataProvider } from '../user-data/user-data';

@Injectable()
export class TokenInterceptorProvider implements HttpInterceptor {

  constructor(private userData: UserDataProvider) {
    console.log('Hello TokenInterceptorProvider Provider');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    request = request.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.userData.getToken()
      }
    });
    return next.handle(request);
  }

}
