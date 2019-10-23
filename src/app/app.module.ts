import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule, JsonpModule } from '@angular/http';
import { RequestInterceptor } from './app-interceptor';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import zh from '@angular/common/locales/zh';

import { AppRoutingModule } from './app-routing.module';

import { ConfigService } from './app-config.service';
import { AppCanActivate } from './app-canactivate.service';
import { NgxWatcherService } from 'ngx-watcher';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ResetPlanComponent } from './reset-plan/reset-plan.component';
import { BtsManageComponent } from './bts-manage/bts-manage.component';
import { AbnormalShowedComponent } from './abnormal-showed/abnormal-showed.component';
import { ResetResultComponent } from './reset-result/reset-result.component';
import { ManualResetComponent } from './manual-reset/manual-reset.component';
import { FooterComponent } from './footer/footer.component';
import { CheckUserComponent } from './check-user/check-user.component';
import { ResetResultTodyComponent } from './reset-result-tody/reset-result-tody.component';
import { AbnormalShowedExpetComponent } from './abnormal-showed-expet/abnormal-showed-expet.component';
import { ResetResultExpetComponent } from './reset-result-expet/reset-result-expet.component';
import { ResidueStationComponent } from './residue-station/residue-station.component';
import { AbnormalDiagnosticComponent } from './abnormal-diagnostic/abnormal-diagnostic.component';
import { PendingDetailComponent } from './pending-detail/pending-detail.component';
import { BookingPlanComponent } from './booking-plan/booking-plan.component';
import { PendingBookingResetComponent } from './pending-booking-reset/pending-booking-reset.component';

registerLocaleData(zh);
export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ResetPlanComponent,
    BtsManageComponent,
    AbnormalShowedComponent,
    ResetResultComponent,
    ManualResetComponent,
    FooterComponent,
    CheckUserComponent,
    ResetResultTodyComponent,
    AbnormalShowedExpetComponent,
    ResetResultExpetComponent,
    ResidueStationComponent,
    AbnormalDiagnosticComponent,
    PendingDetailComponent,
    BookingPlanComponent,
    PendingBookingResetComponent
  ],
  imports: [
    FormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    HttpModule,
    JsonpModule,
    NgxEchartsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
    { provide: NZ_I18N, useValue: zh_CN },
    ConfigService,
    AppCanActivate,
    NgxWatcherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
