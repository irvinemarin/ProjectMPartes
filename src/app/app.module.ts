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
import {DetalleActividadComponent} from './client/detalle-actividad/detalle-actividad.component';
import {RouterModule, Routes} from '@angular/router';
import {NavBarComponent} from './partial/nav-bar/nav-bar.component';
import {MainComponent} from './client/main/main.component';
import {SinUpComponent} from './client/sin-up/sin-up.component';
import {FooterComponent} from './partial/footer/footer.component';
import {MatListModule} from '@angular/material/list';
import {IndexComponent} from './admin/actividades/index/index.component';
import {LOCALE_ID, NgModule} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMenuModule} from '@angular/material/menu';
import {AlertDialogDelete} from './dialogs/dialog-delete/alert-dialog-delete.component';
import {AlertDialogCreate} from './dialogs/dialog-create/alert-dialog-create.component';
import {AlertDialogCreateDetail} from './dialogs/dialog-create-detail/alert-dialog-create-detail.component';
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
import {AdminSliderComponent} from './admin/slider/admin-slider/admin-slider.component';
import {NavlineComponent} from './partial/navline/navline.component';
import {MatSelectModule} from '@angular/material/select';
import {AboutComponent} from './client/about/about.component';
import {ContactoComponent} from './client/contacto/contacto.component';
import {AdminAboutusComponent} from './admin/admin-aboutus/admin-aboutus.component';
import {AdminContactoComponent} from './admin/admin-contacto/admin-contacto.component';
import {AlertDialogContacto} from './dialogs/dialog-contacto/alert-dialog-contacto.component';
import {LoginComponent} from './login/login.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {RegistrarDocumentoComponent} from './client/registrar-documento/registrar-documento.component';
import {HttpClientModule} from '@angular/common/http';
import {ConvertSizefilePipe} from '../pipes/convert-sizefile.pipe';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatBadgeModule} from '@angular/material/badge';

const routes: Routes = [
  {path: 'main', component: MainComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'singup', component: SinUpComponent},
  {path: 'reg-doc', component: RegistrarDocumentoComponent},
];


registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AppComponent,
    DetalleActividadComponent,
    AboutComponent,
    NavBarComponent,
    ContactoComponent,
    MainComponent,
    SinUpComponent,
    FooterComponent,
    IndexComponent,
    AlertDialogDelete,
    AlertDialogCreate,
    AlertDialogContacto,
    AlertDialogCreateDetail,
    DialogMultipleFull,
    AdminSliderComponent,
    ConvertSizefilePipe,
    AdminAboutusComponent,
    AdminContactoComponent,
    NavlineComponent,
    LoginComponent,
    RegistrarDocumentoComponent,
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
