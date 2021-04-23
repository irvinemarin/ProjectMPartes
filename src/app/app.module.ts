import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCarouselModule} from '@ngmodule/material-carousel';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {RouterModule, Routes} from '@angular/router';
import {NavBarComponent} from './partial/nav-bar/nav-bar.component';
import {MainComponent} from './client/main/main.component';
import {SinUpComponent} from './client/sin-up/sin-up.component';
import {FooterComponent} from './partial/footer/footer.component';
import {MatListModule} from '@angular/material/list';
import {LOCALE_ID, NgModule} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {AlertDialogDelete} from './dialogs/dialog-warning/alert-dialog-delete.component';
import {ToastrModule} from 'ngx-toastr';
import {NgxImageZoomModule} from 'ngx-image-zoom';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
import {DialogMultipleFull} from './dialogs/dialog-full/alert-dialog-create.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {MatSelectModule} from '@angular/material/select';

import {LoginComponent} from './login/login.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {RegistrarDocumentoComponent} from './client/registrar-documento/registrar-documento.component';
import {HttpClientModule} from '@angular/common/http';
import {ConvertSizefilePipe} from '../pipes/convert-sizefile.pipe';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSidenavModule} from '@angular/material/sidenav';
import {ImpresionDocumentoComponent} from './client/impresion-documento/impresion-documento.component';
import { SettingsAccountComponent } from './admin/settings-account/settings-account.component';
import { DataLoaderComponent } from './admin/data-loader/data-loader.component';

const routes: Routes = [
  {path: 'main', component: MainComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'singup', component: SinUpComponent},
  {path: 'reg-doc', component: RegistrarDocumentoComponent},
  {path: 'print', component: ImpresionDocumentoComponent},
  {path: 'admin', component: DataLoaderComponent},
];


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    MainComponent,
    SinUpComponent,
    FooterComponent,
    AlertDialogDelete,
    DialogMultipleFull,
    ConvertSizefilePipe,
    LoginComponent,
    RegistrarDocumentoComponent,
    ImpresionDocumentoComponent,
    SettingsAccountComponent,
    DataLoaderComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatBadgeModule,
    NgxImageZoomModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatTabsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }),
    MatFormFieldModule,
    MatCheckboxModule,
    MatCarouselModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatMenuModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    RouterModule.forRoot(routes),
    MatSelectModule,
    MatTableModule,
    MatSortModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es'}, AngularFirestoreModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}
