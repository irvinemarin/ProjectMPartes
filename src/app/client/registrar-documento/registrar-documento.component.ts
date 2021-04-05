import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {JavaApiService} from '../../api/api_java/java-api.service';
import {DataModalMultiple, DialogMultipleFull} from '../../dialogs/dialog-image-full/alert-dialog-create.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-registrar-documento',
  templateUrl: './registrar-documento.component.html',
  styleUrls: ['./registrar-documento.component.css']
})
export class RegistrarDocumentoComponent implements OnInit {
  valueFileSelected: '';
  @ViewChild('fileInput')
  fileInput;

  SEL_ACTOPROCESAL = [];
  PERSONA_lIST = [];
  FILES_UPLOADS = [];
  files: Array<File> = null;
  private SEL_TIPOMOTIVO = [];
  dataFormEncontrado = {
    recursoValue: '',
    expedienteValue: '',
    nUnico: ''
  };

  constructor(
    private toastr: ToastrService,
    private api: JavaApiService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    // this.SEL_ACTOPROCESAL.push(
    //   {id: '001', dsc: 'ESCRITO'},
    //   {id: '002', dsc: 'ESCRITO2'},
    //   {id: '003', dsc: 'ESCRITO3'},
    //   {id: '004', dsc: 'ESCRITO4'},
    // );
    // this.PERSONA_lIST.push(
    //   {id: '001', dsc: 'PERSONA01'},
    //   {id: '002', dsc: 'PERSONA02'},
    //   {id: '003', dsc: 'PERSONA03'},
    //   {id: '004', dsc: 'PERSONA04'},
    // );

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

    if (this.files != null && this.files.length > 0) {
      this.toastr.warning('Subiendo archivo');
      this.uploadFileFirebase();

    } else {
      this.toastr.warning('Debe seleccionar almenos un archivo');
    }
  }

  private uploadFileFirebase() {
    for (let i = 0; i < this.files.length; i++) {
      this.FILES_UPLOADS.push(this.files[i]);
    }
    this.files = null;
    console.table(this.FILES_UPLOADS);
  }

  onClickBuscarExpedienteListener() {
    const dialogo1 = this.dialog.open(DialogMultipleFull, {
      data: new DataModalMultiple(
        'BUSCAR EXPEDIENTE', this.SEL_TIPOMOTIVO)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result['expediente'].n_unico != null) {
        this.PERSONA_lIST = result['listParteExpedientes'];
        // n_ano_sala: 2020
        // n_exp_sala: 89
        // n_expediente: "122"
        // n_unico: "2020001225001212"
        // x_desc_motivo_ingreso: "NULIDAD"
        // x_formato: "00122-2020-0-5001-SU-PE-01"
        this.dataFormEncontrado.recursoValue = `${result['expediente'].x_desc_motivo_ingreso} ${result['expediente'].n_exp_sala} ${result['expediente'].n_ano_sala} `;
        this.dataFormEncontrado.expedienteValue = result['expediente'].x_formato;
        this.dataFormEncontrado.nUnico = result['expediente'].n_unico;
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

  onDeleteFileClickListener(itemFile) {
    this.PERSONA_lIST.splice(
      this.PERSONA_lIST
        .findIndex(
          x =>
            (x.n_secuencia + '_' + x.x_doc_id) === (itemFile.n_secuencia + '_' + itemFile.x_doc_id)
        ), 1);
  }
}
