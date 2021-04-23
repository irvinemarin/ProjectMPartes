import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSelect} from '@angular/material/select';
import {JavaApiService} from '../../api/api_java/java-api.service';
import {ToastrService} from 'ngx-toastr';
import {FileData} from '../../client/registrar-documento/registrar-documento.component';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {AlertDialogDelete, DataModal} from '../dialog-warning/alert-dialog-delete.component';

export class DataModalMultiple {
  constructor(
    public title: String,
    public objectData: any
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
  FILES_LIST: Array<any>;


  constructor(
    private api: JavaApiService,
    private apiFirebase: WebServiceAPIService,
    public dialogRef: MatDialogRef<DialogMultipleFull>,
    private dialogDelete: MatDialog,
    private toastr: ToastrService,
    @ Inject(MAT_DIALOG_DATA) public data: DataModalMultiple) {
    this.UrlImage = data.title;
    this.SEL_MOTIVOINGRESO = data.objectData;

  }

  ngOnInit(): void {

    if (this.data.title == 'EDITAR DOCUMENTOS ADJUNTOS') {
      this.apiFirebase.getDataEscritosDocumentos(this.data.objectData.id).subscribe((res: any[]) => {
        this.FILES_LIST = res;

      }, (error) => {
        this.toastr.error('No se pudo Obtener algunos datos ACTUALIZE la pagina', '');
      });
    }

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
    this.apiFirebase.getDatosExpedienteEncontrado('', this.nroSala, anio, motivoIngreso).subscribe(
      response => {
        if (response != null) {
          let expedienteEncontrado = null;
          response.forEach(item => {
            if (item.n_exp_sala == this.nroSala && item.n_ano == anio && item.c_motivo_ingreso == motivoIngreso) {
              expedienteEncontrado = item;
            }
          });

          this.dialogRef.close(expedienteEncontrado);
        }
      },
      error => {
        this.toastr.error('EXPEDIENTE NO ENCONTRADO');
      }
    );
  }

  onDeleteFileClickListener(itemFile: FileData) {
    this.openDialogDelete(0, itemFile, 'FILE');
  }

  openDialogDelete(postition: number, itemFile, typeObject: string): void {
    const dialogo1 = this.dialogDelete.open(AlertDialogDelete, {
      data: new DataModal(
        'Eliminar  ' + itemFile.name, 'Esta seguro que quiere eliminar este documento?', typeObject, itemFile)
    });

    let toast = this.toastr;

    dialogo1.afterClosed().subscribe(result => {
      if (result == 'F_DEL') {

        let desertRef = this.apiFirebase.referenciaCloudStorage(`${itemFile.nUnico}/${itemFile.name}`);
        let files = this.FILES_LIST;

        desertRef.delete().subscribe(function(response) {
            files.splice(files.findIndex(x =>
              (x.urlSaved) === (itemFile.urlSaved)
            ), 1);
          },
          error => {
          }
        );


        this.apiFirebase.deleteDataItem('escritosDocumentos', itemFile.id)
          .then(function(response) {
            toast.success('Archivo Eliminado');
          }).catch(
          error => {
            toast.error('NO Eliminado ');

          });
      }
    });
  }

  onClickCancelarEliminarArchivo() {
    this.dialogRef.close('CANCEL');
  }

  onSetDocumentoPrincipalClickListener(itemFile) {
    this.FILES_LIST.forEach(item => {
      item.isDocPrincipal = false;
    });

    if (!itemFile.isDocPrincipal) {
      itemFile.isDocPrincipal = true;
    } else {
      itemFile.isDocPrincipal = false;
    }

    this.FILES_LIST.forEach(itemFor => {

      console.log('idDocumento : ' + itemFor['id']);

      this.apiFirebase.editData(itemFor['id'], 'ESC_DOC', itemFor.isDocPrincipal)
        .then(response => {
          this.toastr.success('Cambios Guardados');
        })
        .catch(
          error => {
            this.toastr.error('Cambios NO GUARDADOS');
          }
        );
    });


  }
}

