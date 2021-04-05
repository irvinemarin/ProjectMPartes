import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Observable, Observer} from 'rxjs';
import {MatSelect} from '@angular/material/select';
import {JavaApiService} from '../../api/api_java/java-api.service';
import {ToastrService} from 'ngx-toastr';

export class DataModalMultiple {
  constructor(
    public title: String,
    public motivoIngresoData: any[]
  ) {

  }

}

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './alert-dialog-create.component.html',
  styleUrls: ['./alert-dialog-create.component.css']
})
export class DialogMultipleFull implements OnInit {

  UrlImage: String = '';

  public itemDeleted = false;
  SEL_MOTIVOINGRESO = [];
  nroSala = '';


  constructor(
    private api: JavaApiService,
    public dialogRef: MatDialogRef<DialogMultipleFull>,
    private toastr: ToastrService,
    @ Inject(MAT_DIALOG_DATA) public data: DataModalMultiple) {
    this.UrlImage = data.title;
    this.SEL_MOTIVOINGRESO = data.motivoIngresoData;

  }

  ngOnInit(): void {
  }


  cancelar(): void {
    this.dialogRef.close('CANCEL');
  }

  onClickAceptar() {
    this.dialogRef.close('ACEPTAR');

  }

  onClickCancelarBusqueda() {
    this.dialogRef.close('CANCEL_BUSQUEDA');
  }

  onclickBuscarExpedienteListener(sel_anio: MatSelect, sel_motivoIngreso: MatSelect) {
    let anio = sel_anio.value;
    let motivoIngreso = sel_motivoIngreso.value;
    if (motivoIngreso != '' && anio != '' && this.nroSala != '') {
      this.getWSBuscarExpediente(anio, motivoIngreso);
    } else {
      this.toastr.error('Ingresar los datos de busqueda');
    }

  }

  private getWSBuscarExpediente(anio: '', motivoIngreso: '') {
    this.api.getDatosExpedienteEncontrado('', this.nroSala, anio, motivoIngreso).subscribe(
      response => {
        if (response['expediente'] != null) {
          this.dialogRef.close(response);
        }
      },
      error => {
        this.toastr.error('EXPEDIENTE NO ENCONTRADO');
      }
    );
  }
}

