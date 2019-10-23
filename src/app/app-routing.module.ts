import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AbnormalShowedComponent } from './abnormal-showed/abnormal-showed.component';
import { ResetResultComponent } from './reset-result/reset-result.component';
import { ManualResetComponent } from './manual-reset/manual-reset.component';
import { CheckUserComponent } from './check-user/check-user.component';
import { ResetResultTodyComponent } from './reset-result-tody/reset-result-tody.component';
import { ResetResultExpetComponent } from './reset-result-expet/reset-result-expet.component';
import { AbnormalShowedExpetComponent } from './abnormal-showed-expet/abnormal-showed-expet.component';
import { ResidueStationComponent } from './residue-station/residue-station.component';
import { AbnormalDiagnosticComponent } from './abnormal-diagnostic/abnormal-diagnostic.component';
import { PendingDetailComponent } from './pending-detail/pending-detail.component';
import { PendingBookingResetComponent } from './pending-booking-reset/pending-booking-reset.component';
import { AppCanActivate } from './app-canactivate.service';


const routes: Routes = [
  // { path: '', redirectTo: '/abnormalShowed', pathMatch: 'full'},
  { path: '', component: CheckUserComponent, canActivate: [AppCanActivate]},
  { path: 'abnormalDiagnostic', component: AbnormalDiagnosticComponent, canActivate: [AppCanActivate]},
  { path: 'pendingDetail', component: PendingDetailComponent, canActivate: [AppCanActivate]},
  { path: 'abnormalShowed', component: AbnormalShowedComponent, canActivate: [AppCanActivate]},
  { path: 'resetResult', component: ResetResultComponent, canActivate: [AppCanActivate]},
  { path: 'manualReset', component: ManualResetComponent, canActivate: [AppCanActivate]},
  { path: 'resetResultTody', component: ResetResultTodyComponent, canActivate: [AppCanActivate]},
  { path: 'resetResultExpet', component: ResetResultExpetComponent, canActivate: [AppCanActivate]},
  { path: 'abnormalShowedExpet', component: AbnormalShowedExpetComponent, canActivate: [AppCanActivate]},
  { path: 'ResidueStation', component: ResidueStationComponent, canActivate: [AppCanActivate]},
  { path: 'pendingBooking', component: PendingBookingResetComponent, canActivate: [AppCanActivate]},
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}
