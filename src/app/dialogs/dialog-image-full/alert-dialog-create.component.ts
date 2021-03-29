import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable, Observer} from 'rxjs';

export class DataModalImage {
  constructor(public title: String) {

  }

}

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './alert-dialog-create.component.html',
  styleUrls: ['./alert-dialog-create.component.css']
})
export class DialogImageFull implements OnInit {

  UrlImage: String = '';

  public itemDeleted = false;


  constructor(
    public dialogRef: MatDialogRef<DialogImageFull>,
    @ Inject(MAT_DIALOG_DATA) public data: DataModalImage) {
    this.UrlImage = data.title;
  }

  ngOnInit(): void {
  }


  cancelar(): void {
    this.dialogRef.close('CANCEL');
  }

  onClickAceptar() {
    this.dialogRef.close('ACEPTAR');

  }
}

