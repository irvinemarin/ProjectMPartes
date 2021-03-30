import {Component, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-registrar-documento',
  templateUrl: './registrar-documento.component.html',
  styleUrls: ['./registrar-documento.component.css']
})
export class RegistrarDocumentoComponent implements OnInit {
  valueFileSelected: '';
  @ViewChild('fileInput')
  fileInput;

  SEL_TIPOESCRITOS = [];
  PERSONA_lIST = [];
  FILES_UPLOADS = [];
  files: Array<File> = null;

  constructor(
    private toastr: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.SEL_TIPOESCRITOS.push(
      {id: '001', dsc: 'ESCRITO'},
      {id: '002', dsc: 'ESCRITO2'},
      {id: '003', dsc: 'ESCRITO3'},
      {id: '004', dsc: 'ESCRITO4'},
    );
    this.PERSONA_lIST.push(
      {id: '001', dsc: 'PERSONA01'},
      {id: '002', dsc: 'PERSONA02'},
      {id: '003', dsc: 'PERSONA03'},
      {id: '004', dsc: 'PERSONA04'},
    );
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
    console.table(this.FILES_UPLOADS);
  }
}
