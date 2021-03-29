import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {Section} from '../../admin/actividades/index/index.component';
import {AngularFirestore} from '@angular/fire/firestore';

export class DataModalCreateDetail {
  constructor(public title: string, public wichObject: string, public idPatent: string) {

  }

}

let URLPublica: string = '';

@Component({
  selector: 'app-dialog-content-example',
  templateUrl: './alert-dialog-create-detail.component.html',
  styleUrls: ['./alert-dialog-create-detail.component.css']
})
export class AlertDialogCreateDetail implements OnInit {

  title = '';
  wichObject = '';
  public itemDeleted = false;

  porcentaje: number;
  private finalizado: boolean;
  private URLPublica: string;

  constructor(
    public dialogRef: MatDialogRef<AlertDialogCreateDetail>,
    @ Inject(MAT_DIALOG_DATA) public data: DataModalCreateDetail,
    private api: WebServiceAPIService,
    private firestore: AngularFirestore,
  ) {
    this.title = data.title;
    this.wichObject = data.wichObject;

  }

  ngOnInit(): void {
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  crear(titulo: HTMLInputElement, descripcion: HTMLTextAreaElement, fileInput: HTMLInputElement) {
    this.onSubmit(titulo.value, 'none', descripcion.value, fileInput.files[0]);

    // alert(titulo.value);
  }

  itemActividadRE = new Section();

  onSubmit(titulo: string, introduccion: string, descripcion: string, fileItem: File) {

    this.itemActividadRE = new Section();
    this.itemActividadRE.titulo = titulo;
    this.itemActividadRE.idParent = this.data.idPatent;
    this.itemActividadRE.dsc = descripcion;
    this.itemActividadRE.urlName = (fileItem != null) ? fileItem.name : '';
    this.itemActividadRE.urlDecode = (fileItem != null) ? fileItem.name : '';
    this.itemActividadRE.dateRegister = new Date().toLocaleString();
    // itemActividadRE.recurso = fileItem;
    let resultCreatedID = '';
    let api = this.api;
    let dialog = this.dialogRef;
    let firestore = this.firestore;
    let nameRef = (this.wichObject == 'D_ACT') ? 'detActividad' : 'detAgenda';
    let wichObject = this.wichObject;

    this.api.createElementoDetail(this.itemActividadRE, api, fileItem, dialog, firestore, this.URLPublica, nameRef, wichObject)
      .then(function(docRef) {
        resultCreatedID = docRef.id;
        let archivo = fileItem;
        if (fileItem != null) {

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
                    console.log('Document successfully updated!');
                    if (wichObject == 'AC') {
                      dialog.close('CR_AC');
                    } else {
                      dialog.close('CR_AG');
                    }
                  })
                  .catch(function(error) {
                    // The document probably doesn't exist.
                    console.error('Error updating document: ', error);
                  });
              });
            }
          });


        } else {
          dialog.close('CR_AG');
        }


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

  readImg() {
    let reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => {
      this.urlPreview = reader.result;
    };
  }
}

