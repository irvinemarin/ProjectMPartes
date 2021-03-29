import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {Section} from '../../admin/actividades/index/index.component';
import {AngularFirestore} from '@angular/fire/firestore';

export class DataModalCreate {
  constructor(public title: string, public wichObject: string) {

  }

}

let URLPublica: string = '';

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './alert-dialog-create.component.html',
  styleUrls: ['./alert-dialog-create.component.css']
})
export class AlertDialogCreate implements OnInit {

  title = '';
  wichObject = '';
  public itemDeleted = false;

  porcentaje: number;
  private finalizado: boolean;
  private URLPublica: string;

  constructor(
    public dialogRef: MatDialogRef<AlertDialogCreate>,
    @ Inject(MAT_DIALOG_DATA) public data: DataModalCreate,
    private api: WebServiceAPIService,
    private firestore: AngularFirestore,
  ) {
    this.title = data.title;
    this.wichObject = data.wichObject;
  }

  ngOnInit(): void {


    if (this.wichObject == 'SL') {
      this.isHideExtraForm = true;
      this.cols = 1;
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  crear(titulo: HTMLInputElement, descripcion: HTMLTextAreaElement, fileInput: HTMLInputElement, fechaActividad: HTMLInputElement) {
    this.onSubmit(titulo.value, 'none', descripcion.value, fileInput.files[0]);

    // alert(titulo.value);
  }

  itemActividadRE = new Section();

  onSubmit(titulo: string, introduccion: string, descripcion: string, fileItem: File) {

    this.itemActividadRE = new Section();
    this.itemActividadRE.titulo = titulo;
    this.itemActividadRE.dsc = descripcion;
    this.itemActividadRE.urlName = fileItem.name;
    this.itemActividadRE.urlDecode = fileItem.name;
    this.itemActividadRE.dateRegister = new Date().toLocaleString();
    // itemActividadRE.recurso = fileItem;
    let resultCreatedID = '';
    let api = this.api;
    let dialog = this.dialogRef;
    let firestore = this.firestore;
    // let nameRef = (this.wichObject == 'AC') ? 'actividades' : 'agendas';

    let nameRef: string;
    if (this.wichObject == 'AC') {
      nameRef = 'actividades';
    } else if (this.wichObject == 'AG') {
      nameRef = 'agendas';
    } else if (this.wichObject == 'SL') {
      nameRef = 'slider';
    }


    let wichObject = this.wichObject;
    let isHideProggresLocal = false;

    this.isHideProggres = isHideProggresLocal;

    this.api.createElemento(this.itemActividadRE, api, fileItem, dialog, firestore, this.URLPublica, nameRef, wichObject)
      .then(function(docRef) {

        resultCreatedID = docRef.id;
        let archivo = fileItem;
        let referencia = api.referenciaCloudStorage(`${resultCreatedID}_${archivo.name}`);
        let tarea = api.tareaCloudStorage(`${resultCreatedID}_${archivo.name}`, archivo);
        tarea.percentageChanges().subscribe((porcentaje) => {
          let porcentajeResult = Math.round(porcentaje);
          if (porcentajeResult == 100) {
            referencia.getDownloadURL().subscribe((URL) => {
              const actividadRef = firestore.collection(nameRef).doc(resultCreatedID);
              // Set the 'capital' field of the city
              actividadRef.update({
                urlDecode: URL
              })
                .then(function() {
                  if (wichObject == 'AC') {
                    dialog.close('CR_AC');
                  } else {
                    dialog.close('CR_AG');
                  }
                  isHideProggresLocal = true;
                })
                .catch(function(error) {
                  // The document probably doesn't exist.
                  console.error('Error updating document: ', error);
                  isHideProggresLocal = true;
                });
            });
          }
        });


      })
      .catch(function(error) {
        console.error('Error adding document: ', error);
      });

  }

  @ViewChild('fileInput')
  fileInput;

  file: File | null = null;

  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }


  //Sube el archivo a Cloud Storage
  subirArchivo(resultCreatedID: string) {


    let archivo = this.file;
    let referencia = this.api.referenciaCloudStorage(`${resultCreatedID}_${archivo.name}`);
    let tarea = this.api.tareaCloudStorage(`${resultCreatedID}_${archivo.name}`, archivo);
    //Cambia el porcentaje
    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;

      }
    });

    referencia.getDownloadURL().subscribe((URL) => {
      console.log(URL);
      URLPublica = URL;
    });
  }


  onChangeFileInput(): void {
    let files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];

    this.readImg();
  }

  urlPreview: any;
  isDisabledBtn = false;
  isHideExtraForm = false;
  cols = 2;
  istCol6 = true;
  istCol12 = false;
  isHideProggres = true;

  readImg() {
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.urlPreview = reader.result;
    };
  }
}

