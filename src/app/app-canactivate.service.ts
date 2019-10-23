import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route, Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CanActivateChild } from '@angular/router/src/interfaces';
import { ConfigService } from './app-config.service';

@Injectable()
export class AppCanActivate implements CanActivate, CanActivateChild, CanLoad {

  constructor(private router: Router, private config: ConfigService) {
    const token = sessionStorage.getItem('token') === null ? '' : sessionStorage.getItem('token');
    if (token !== '') {
      this.router.navigate(['/abnormalDiagnostic']);
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    if (!localStorage.getItem('apiConfig')) {
      this.config.getConfig();
    }
    if (!localStorage.getItem('geoJson')) {
      this.config.getGeoJson();
    }
    return true;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    return true;
  }

}
