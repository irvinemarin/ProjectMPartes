import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSelect} from '@angular/material/select';
import {JavaApiService} from '../../api/api_java/java-api.service';
import {ToastrService} from 'ngx-toastr';
import {FileData} from '../../client/registrar-documento/registrar-documento.component';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {AlertDialogDelete, DataModal} from '../dialog-warning/alert-dialog-delete.component';
import {UtilArrays} from '../../utils/util-arrays';

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
  DATA_USER_FORM = [];
  DATA_USER_DB = [];
  tipoPersona = '';


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

  modoEditInfo = false;
  UserLogged;
  idUserDB;
  isHideProggres = true;
// value
  tipoDocSelected = '';
  ColegioAbogadoSelected = '';
  imgProfile = '';
  correo = '';

  ngOnInit(): void {

    if (this.data.title == 'EDITAR DOCUMENTOS ADJUNTOS') {
      this.apiFirebase.getDataEscritosDocumentos(this.data.objectData.id).subscribe((res: any[]) => {
        this.FILES_LIST = res;

      }, (error) => {
        this.toastr.error('No se pudo Obtener algunos datos ACTUALIZE la pagina', '');
      });

    }

    if (this.data.title == 'MI INFORMACION') {
      this.UserLogged = JSON.parse(localStorage.getItem('user'));
      this.apiFirebase.getDataUser(this.UserLogged.uid).subscribe((res: any[]) => {
        this.DATA_USER_DB = [];
        this.DATA_USER_FORM = [];
        if (res[0] != null) {
          let userDbInfo = res[0];
          this.idUserDB = userDbInfo.id;
          this.tipoDocSelected = userDbInfo.tipoDoc;
          this.imgProfile = userDbInfo.photoURL;
          this.correo = userDbInfo.email;
          this.tipoPersona = userDbInfo.tipoPersona;
          this.ColegioAbogadoSelected = userDbInfo.colegioAbogado;
          this.DATA_USER_FORM = UtilArrays.getPopulateFormsList(userDbInfo);
          this.DATA_USER_DB = UtilArrays.getPopulateFormsList(userDbInfo);

        }


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
          this.dialogRef.close(response);
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

  onClickModeEditClickListener() {
    if (this.modoEditInfo) {
      this.modoEditInfo = false;
    } else {
      this.modoEditInfo = true;
    }
  }

  onClickModeEditCancelClickListener() {
    this.modoEditInfo = false;
  }

  onClickModeEditSaveClickListener() {


    this.isHideProggres = false;
    let count = 0;
    this.DATA_USER_FORM.forEach(item => {
      let value = item.value;
      let value2 = this.DATA_USER_DB[count].value;
      if (item.isSelect) {
        value = item.selected;
        value2 = this.DATA_USER_DB[count].selected;
      }


      if (value != value2) {


        this.apiFirebase.editDataUser(this.idUserDB, item.columName, value)
          .then(response => {
            this.toastr.success('Cambios Guardados ' + item.labelText);
          })
          .catch(
            error => {
              this.toastr.error('Cambios NO GUARDADOS');
            }
          );
      }
      count++;
    });

    if (count == this.DATA_USER_FORM.length) {
      this.isHideProggres = true;
    }

    this.modoEditInfo = false;

  }

  onSelectItemChangeListener(itemColum, value: any) {
    itemColum.selected = value;
  }
}

