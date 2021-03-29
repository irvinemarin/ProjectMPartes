import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable, Observer} from 'rxjs';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {Section} from '../../admin/actividades/index/index.component';

export class DataModal {
  constructor(public title: string, public message: string, public typeObject: string, public  folder: Section) {

  }

}

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './alert-dialog-delete.component.html',
  styleUrls: ['./alert-dialog-delete.component.css']
})
export class AlertDialogDelete implements OnInit {

  title = '';
  message = '';
  section: Section;
  typeObject = '';
  public itemDeleted = false;
  isHideProggres = true;

  constructor(
    public dialogRef: MatDialogRef<AlertDialogDelete>,
    @ Inject(MAT_DIALOG_DATA) public data: DataModal,
    private service: WebServiceAPIService
  ) {
    this.title = data.title;
    this.message = data.message;
    this.section = data.folder;
    this.typeObject = data.typeObject;
  }

  ngOnInit(): void {
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  elimnar() {
    let idItem = this.section.id;
    let dialog = this.dialogRef;
    let isHideProggresLocal = false;

    this.isHideProggres = isHideProggresLocal;
    this.service.deleteItem(this.typeObject, idItem, dialog).then(function() {
      console.log('Document successfully deleted!');
      dialog.close('Deleted');
      isHideProggresLocal = true;
    }).catch(function(error) {
      console.error('Error removing document: ', error);
      isHideProggresLocal = true;
    });
  }
}

