import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // let token = "qwertyuoiutsd" 
    
    let header = req.clone({
      setHeaders:{
        Authorization:'qwertyuoiutsd'
      }
    })
    return next.handle(header);
  }
}
