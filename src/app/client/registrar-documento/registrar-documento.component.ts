import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {JavaApiService} from '../../api/api_java/java-api.service';
import {DataModalMultiple, DialogMultipleFull} from '../../dialogs/dialog-full/alert-dialog-create.component';
import {MatDialog} from '@angular/material/dialog';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {AlertDialogDelete, DataModal} from '../../dialogs/dialog-warning/alert-dialog-delete.component';
import {WSAuthService} from '../../api/ws-api_mpartes.service';

import {formatDate} from '@angular/common';

@Component({
  selector: 'app-registrar-documento',
  templateUrl: './registrar-documento.component.html',
  styleUrls: ['./registrar-documento.component.css']
})
export class RegistrarDocumentoComponent implements OnInit {
  valueFileSelected: '';
  @ViewChild('fileInput')
  fileInput;

  SEL_ACTOPROCESAL = Array<any>();
  PERSONA_lIST = [];
  FILES_UPLOADS = Array<FileData>();
  files: Array<File> = null;
  private SEL_TIPOMOTIVO = [];
  dataFormEncontrado = {
    recursoValue: '',
    expedienteValue: '',
    nUnico: '',
    observacionValue: '',
    tipoEscritoId: '',
    valueTipoEscritoSelected: '',
    nIncidente: '',
    cInstancia: '',
    fIngreso: ''
  };

  constructor(
    private toastr: ToastrService,
    private api: JavaApiService,
    private apiFirebase: WebServiceAPIService,
    private apiAuth: WSAuthService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

    this.api.getDataInicial().subscribe((data: any[]) => {
      this.PERSONA_lIST = data['listParteExpedientes'];
      this.SEL_ACTOPROCESAL = data['listActoProcesal'];
      this.SEL_TIPOMOTIVO = data['listTipoMotivo'];
    }, (error) => {
      this.toastr.error('No se pudo Obtener algunos datos ACTUALIZE la pagina', '');
    });


  }


  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    this.files = this.fileInput.nativeElement.files;
  }

  onUploadFilesClickListerner() {

    if (this.dataFormEncontrado.nUnico == '') {
      this.toastr.warning('Debe seleccionar un EXPEDIENTE primero');
    } else if (this.files != null && this.files.length > 0) {
      this.toastr.warning('Subiendo archivo');
      this.uploadFileFirebase();

    } else {
      this.toastr.warning('Debe seleccionar almenos un archivo');
    }
  }

  private uploadFileFirebase() {
    this.countUploadSuccess = 0;
    for (let i = 0; i < this.files.length; i++) {
      this.subirArchivo('asd', this.files[i]);
    }

  }


  onClickBuscarExpedienteListener() {
    const dialogo1 = this.dialog.open(DialogMultipleFull, {
      data: new DataModalMultiple(
        'BUSCAR EXPEDIENTE', this.SEL_TIPOMOTIVO)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result['expediente'].n_unico != null) {
        this.PERSONA_lIST = result['listParteExpedientes'];

        this.dataFormEncontrado.recursoValue = `${result['expediente'].x_desc_motivo_ingreso} ${result['expediente'].n_exp_sala} ${result['expediente'].n_ano_sala} `;
        this.dataFormEncontrado.expedienteValue = result['expediente'].x_formato;
        this.dataFormEncontrado.nUnico = result['expediente'].n_unico;
        this.dataFormEncontrado.nIncidente = result['expediente'].n_incidente;
        this.dataFormEncontrado.cInstancia = result['expediente'].c_instancia;
        this.dataFormEncontrado.fIngreso = result['expediente'].f_ingreso;
        console.log(result['expediente'].n_unico);
      }
    });
  }

  onClickCancelarBuscarExpedienteListener() {
    this.dataFormEncontrado.recursoValue = '';
    this.dataFormEncontrado.expedienteValue = '';
    this.dataFormEncontrado.nUnico = '';
    this.PERSONA_lIST = [];

  }

  onDeleteParteClickListener(itemPersona: any) {
    this.PERSONA_lIST.splice(
      this.PERSONA_lIST
        .findIndex(
          x =>
            (x.n_secuencia + '_' + x.x_doc_id) === (itemPersona.n_secuencia + '_' + itemPersona.x_doc_id)
        ), 1);
  }

  onDeleteFileClickListener(itemFile: FileData) {
    this.openDialogDelete(0, itemFile, 'FILE');
  }


  openDialogDelete(postition: number, itemFile, typeObject: string): void {
    const dialogo1 = this.dialog.open(AlertDialogDelete, {
      data: new DataModal(
        'Eliminar ' + itemFile.name, 'Esta seguro que quiere eliminar este documento?', typeObject, itemFile)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result == 'F_DEL') {

        let nunico = this.dataFormEncontrado.nUnico;
        let desertRef = this.apiFirebase.referenciaCloudStorage(`${nunico}_${itemFile.name}`);
        let files = this.FILES_UPLOADS;

        desertRef.delete().subscribe(function(response) {
            files.splice(files.findIndex(x =>
              (x.urlSaved) === (itemFile.urlSaved)
            ), 1);
          },
          error => {
          }
        );
      }
    });
  }

  countUploadSuccess = 0;

  //Sube el archivo a Cloud Storage
  subirArchivo(resultCreatedID: string, file: File) {
    let archivo = file;
    let URLSaved;
    let nunico = this.dataFormEncontrado.nUnico;
    let referencia = this.apiFirebase.referenciaCloudStorage(`${nunico}_${archivo.name}`);
    let tarea = this.apiFirebase.tareaCloudStorage(`${nunico}_${archivo.name}`, archivo);
    referencia.getDownloadURL().subscribe((URL) => {

      URLSaved = URL;
    });
    tarea.percentageChanges().subscribe((porcentaje) => {
      let porcentajeResul;
      porcentajeResul = Math.round(porcentaje);
      if (porcentajeResul == 100) {

        if (URLSaved == '') {
          this.toastr.error('Se ha producido un Error vuelva a intentarlo');
        } else {
          if (this.FILES_UPLOADS.find((test) => test.urlSaved === URLSaved) === undefined) {

            const reader2 = new FileReader();
            let numberPages = 0;
            reader2.readAsBinaryString(archivo);
            reader2.onload = () => {
              if (typeof reader2.result === 'string') {
                numberPages = reader2.result.match(/\/Type[\s]*\/Page[^s]/g).length;
                this.FILES_UPLOADS.push(
                  {
                    idParentFirebase: 'nn',
                    nUnico: this.dataFormEncontrado.nUnico,
                    name: archivo.name,
                    size: archivo.size,
                    type: archivo.type,
                    urlSaved: URLSaved,
                    numberPages: numberPages,
                    isDocPrincipal: false,
                  }
                );
                this.countUploadSuccess++;
                if (this.countUploadSuccess == this.files.length) {
                  this.files = null;
                }
              }
            };


          }
        }


      }
    });


  }


  onClickRegistrarExpedienteListener() {

    this.errors = 0;

    this.validarInputs(this.dataFormEncontrado.expedienteValue, 'NO HA SELECCIONADO EXPEDIENTE');
    this.validarInputs(this.dataFormEncontrado.recursoValue, 'NO HA SELECCIONADO RECURSO');
    this.validarInputs(this.dataFormEncontrado.nUnico, 'EXPEDIENTE INCORRECTO');
    this.validarInputs(this.dataFormEncontrado.tipoEscritoId, 'DEBE SELECCIONAR EL TIPO ESCRITO');

    this.validarLengthList(this.FILES_UPLOADS, 'No ha Seleccionado DOCUMENTOS');
    this.validarLengthList(this.PERSONA_lIST, 'No ha Seleccionado PARTES');

    this.validarDocumentoPrincipal();

    if (this.errors == 0) {
      this.saveDataToFirebase();
    }

  }

  private validarDocumentoPrincipal() {
    let thereAreDocPrincipal = false;
    this.FILES_UPLOADS.forEach(item => {
      if (item.isDocPrincipal == true) {
        thereAreDocPrincipal = true;
      }
    });

    if (!thereAreDocPrincipal) {
      this.errors++;
      this.toastr.warning('Debe seleccionar un documentos principal');
    }

  }

  private saveDataToFirebase() {
    let userLogged = JSON.parse(localStorage.getItem('user'));
    // let toDay = formatDate(new Date().toLocaleString(), 'dd/MM/y hh:mm a', 'es');
    let toDay = new Date().toString();

    let dataParent = {
      nUnico: this.dataFormEncontrado.nUnico,
      nIncidente: this.dataFormEncontrado.nIncidente,
      recurso: this.dataFormEncontrado.recursoValue,
      expediente: this.dataFormEncontrado.expedienteValue,
      observacion: this.dataFormEncontrado.observacionValue,
      cActoProcesalID: this.dataFormEncontrado.tipoEscritoId,
      cActoProcesalValue: this.dataFormEncontrado.valueTipoEscritoSelected,
      cActoProcesal: this.dataFormEncontrado.valueTipoEscritoSelected,
      n_fojas: this.getTotalHojas(),
      fechaIngreso: toDay,
      nAbogadouser: userLogged.uid,
      lEstado: 'RE'

    };
    //
    let escritoPresentantes = this.PERSONA_lIST;
    let escritoDocumentos = this.FILES_UPLOADS;
    let estadoEscrito = {
      idParentFirebase: 'nn',
      nAnioEcrito: new Date().getFullYear(),
      xObservacion: this.dataFormEncontrado.observacionValue,
      nSecuencia: this.getSecuencia(),
      fRegistro: new Date().toLocaleString(),
    };
    //
    //
    let toastr = this.toastr;
    let idDocRef = '';
    let apiFirebaseChilds = this.apiFirebase;
    this.apiFirebase.registrarEscritos(dataParent, apiFirebaseChilds)
      .then(function(docRef) {
        alert(docRef.id);
        idDocRef = docRef.id;

        //REGISTRO PRESENTANTES
        escritoPresentantes.forEach(itemPresentantes => {
          itemPresentantes['idParentFirebase'] = idDocRef;
          apiFirebaseChilds.savePresentates(itemPresentantes)
            .then(result => {
              }
            )
            .catch(error =>
              toastr.error(`Error al registrar PRESENTANTES del documento : ${error}`));
        });

        //REGISTRO DOCUMENTOS
        escritoDocumentos.forEach(itemEscrito => {
          itemEscrito.idParentFirebase = idDocRef;
          apiFirebaseChilds.saveDocumento(itemEscrito)
            .then(result => {
              }
            )
            .catch(error =>
              toastr.error(`Error al registrar ARCHIVOS del documento : ${error}`));

        });

        estadoEscrito.idParentFirebase = idDocRef;
        apiFirebaseChilds.saveEstadoEscrito(estadoEscrito)
          .then(result => {
            }
          )
          .catch(error =>
            toastr.error(`Error al registrar ESTADO del documento : ${error}`));

        //SUCCESS REGISTRO
        toastr.success('registro completo');
        window.location.replace('/main');
      })

      .catch(
        error => {
          toastr.error('SERVICIOS NO DISPONIBLES');
        }
      );
  }

  private getSecuencia(): string {
    let secuencia = 0;

    this.apiAuth.getSecuenciaData('asdadf')
      .subscribe(result => {
          if (result.length > 0) {
          } else {
            this.toastr.warning(`SECUNCIA : ${result.length}`);
          }

          secuencia = result.length;
        }
        , error => {
          alert('ERROR');
        }
      );
    return `${secuencia + 1}`;
  }

  private getTotalHojas(): number {
    let nfojas = 0;
    this.FILES_UPLOADS.forEach(item => {
      nfojas = nfojas + item.numberPages;
    });
    return nfojas;
  }

  private validarLengthList(list: any[], msj: string) {
    if (list.length == 0) {
      this.toastr.warning(msj);
      this.errors++;
    }
  }

  errors = 0;

  private validarInputs(valueText: string, imputName: string) {
    if (valueText == '') {
      this.errors++;
      this.toastr.warning(`${imputName}`);
    }
  }

  onChangeValue(tesc: string, x_documento: any) {
    this.dataFormEncontrado.valueTipoEscritoSelected = x_documento;
  }

  onSetDocumentoPrincipalClickListener(itemFile) {

    this.FILES_UPLOADS.forEach(item => {
      item.isDocPrincipal = false;
    });


    // let valueDefault = false;
    if (!itemFile.isDocPrincipal) {
      itemFile.isDocPrincipal = true;
    } else {
      itemFile.isDocPrincipal = false;
    }


    // this.apiFirebase.editData(itemFile.id, 'ESC_DOC', valueDefault)
    //   .then(response => {
    //
    //   })
    //   .catch();
  }
}

export interface FileData {
  isDocPrincipal: boolean;
  idParentFirebase: string;
  name: string;
  size: number;
  type: string;
  urlSaved: string;
  numberPages: number;
  nUnico: string;
}
