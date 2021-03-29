import {Component, OnInit} from '@angular/core';

import {MatDialog} from '@angular/material/dialog';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {AlertDialogContacto, DataModalEdit} from '../../dialogs/dialog-contacto/alert-dialog-contacto.component';


@Component({
  selector: 'app-admin-contacto',
  templateUrl: './admin-contacto.component.html',
  styleUrls: ['./admin-contacto.component.css']
})
export class AdminContactoComponent implements OnInit {
  slides = [];
  dataContancto = {};

  constructor(
    public dialog: MatDialog,
    private api: WebServiceAPIService) {
  }

  ngOnInit(): void {
    this.getDataContactoWS();
    this.getMessagessContactoWS();
  }


  getDataContactoWS = () => {
    this.api.getDataContacto().subscribe((res: any[]) => {
      res.forEach(item => {
        if (item.id == 'data_page') {
          this.dataContancto = item;
        }
      });
    }, (error) => {
    });
  };

  getMessagessContactoWS = () => {
    this.api.getMessagesContacto().subscribe((res: any[]) => {
      res.forEach(item => {

        this.listMessage.push(item);
      });
    }, (error) => {
    });
  };

  listMessage = [];


  openDialogEdit(columName: string): void {
    let elementName = '';
    switch (columName) {
      case 'DIR':
        elementName = 'Direccion';
        break;
      case 'TEL':
        elementName = 'Telefono';
        break;
      case 'EMA':
        elementName = 'Email';

        break;
    }


    const dialogo1 = this.dialog.open(AlertDialogContacto, {
      data: new DataModalEdit(
        'Editar ' + elementName, columName, elementName)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result == 'Modify') {

      }
    });
  }

  editData(columName: string) {
    this.openDialogEdit(columName);
  }
}
