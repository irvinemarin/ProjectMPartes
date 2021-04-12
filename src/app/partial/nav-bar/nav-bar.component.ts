import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {User, WSAuthService} from '../../api/ws-api_mpartes.service';
import {ToastrService} from 'ngx-toastr';
import {AlertDialogDelete, DataModal} from '../../dialogs/dialog-warning/alert-dialog-delete.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, AfterViewInit {
  txtBuscarValue: '';
  imgUserProfile = '';
  hideBadge = true;

  constructor(
    private api: WebServiceAPIService,
    private apiAuth: WSAuthService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    window.scrollTo(0, 0);


  }

  ngOnInit(): void {

    // this.links.push(
    //   {titulo: 'INICIO', abrev: 'HO', active: true},
    //   {titulo: 'CONTACTO', abrev: 'CO', active: false},
    //   {titulo: 'QUIENES SOMOS', abrev: 'AB', active: false}
    // );


    let userStorage: User = JSON.parse(localStorage.getItem('user'));

    if (userStorage == null) {
      window.location.replace('/login');
    } else {
      this.username = userStorage.displayName.split(' ', 1)[0] + '' + userStorage.displayName.split(' ', 2)[1];
      this.imgUserProfile = userStorage.photoURL;


      this.apiAuth.getUserData(userStorage['uid'])
        .subscribe(result => {
            if (result.length > 0) {
              // alert('bienvenido ' + result[0].nombres);

              if (result[0].nombres == '') {
                this.hideBadge = false;
                this.openDialogWarning();
              }

            } else {
              this.toastr.error('Usuario NO Registrado');
            }
          }
          , error => {
            alert('ERROR');
          }
        );
    }

  }

  elementsBody;

  ngAfterViewInit() {
    // you'll get your through 'elements' below code


  }

  dataApp = {};

  private getDataAPP() {


    // this.api.getDataAPP().subscribe((res: any[]) => {
    //   res.forEach(item => {
    //     if (item.id == 'data_app') {
    //       this.dataApp = item;
    //     }
    //   });
    // }, (error) => {
    // });
  }


  links = [];
  activeLink = this.links[0];
  icon_theme = 'brightness_4';
  username = '';


  singOut() {
    this.apiAuth.SignOut();
  }

  onChangeThemeClickListener() {
    // var result = document.getElementsByClassName('body__');
    let elementsBody = document.getElementsByTagName('body');
    let cards = document.getElementsByTagName('mat-card');

    if (this.icon_theme == 'brightness_4') {
      this.icon_theme = 'brightness_5';
      elementsBody[0].style.backgroundColor = '#666666';
      for (let i = 0; i < cards.length; i++) {
        let element = <HTMLElement> cards[i];
        element.style.backgroundColor = '#c5c5c5';
        element.style.color = '#FFF';

      }
    } else {
      this.icon_theme = 'brightness_4';
      elementsBody[0].style.backgroundColor = '#FFF';
      for (let i = 0; i < cards.length; i++) {
        let element = <HTMLElement> cards[i];
        element.style.backgroundColor = '#FFF';
        element.style.color = '#666666';

      }

    }
  }


  openDialogWarning(): void {
    const dialogo1 = this.dialog.open(AlertDialogDelete, {
      data: new DataModal(
        'NECESITA ACTUALIZAR UNOS DATOS ANTES DE CONTINUAR ', 'Ir a actualizar sus datos', 'DATA_EXTRA', null)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result == 'Deleted') {
        // this.actividadListIndex.splice(this.actividadListIndex
        //   .findIndex(x => x.id === folder.id), 1);

      }
    });
  }

}
