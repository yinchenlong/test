import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfigService } from './app-config.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    constructor(private config: ConfigService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const header = req.headers;
        let authReq = req;
        const url = req.url;
        const apiUrl = '';
        if (apiUrl !== '' && url.startsWith(apiUrl)) {
            authReq = req.clone({
                headers: header.set('Micro-App-Access-Token', localStorage.getItem('token'))
            });
            console.log(authReq);
        }
        return next.handle(authReq);
    }
}
