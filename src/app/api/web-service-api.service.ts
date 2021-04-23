import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {AngularFireStorage} from '@angular/fire/storage';
import firebase from 'firebase';
import {map} from 'rxjs/operators';
import {MatDialogRef} from '@angular/material/dialog';
import {AlertDialogDelete} from '../dialogs/dialog-warning/alert-dialog-delete.component';
import {ToastrService} from 'ngx-toastr';
import DocumentData = firebase.firestore.DocumentData;


@Injectable({
  providedIn: 'root'
})
export class WebServiceAPIService {
  private collection: AngularFirestoreCollection<DocumentData>;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {

  }


  createPersonData(data) {
    return this.firestore
      .collection('persons')
      .add(Object.assign({}, data));
  }


  createChildActividad(data) {
    return new Promise<any>((resolve, reject) => {
      this.firestore
        .collection('imagen')
        .add(data)
        .then(res => {
        }, err => reject(err));
    });
  }


  getEscritosList() {
    return this.firestore.collection<any>('escritos').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }));
  }


  //Tarea para subir archivo
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  //Referencia del archivo
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(nombreArchivo);
  }

  getDetalle(idActividad: any, object: string) {

    let ref = (object == 'D-ACT') ? 'detActividad' : 'detAgenda';

    let actividadesDetalleCollectionRef = this.firestore
      .collection<any>(ref);


    return actividadesDetalleCollectionRef.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          }
        );
      }));
  }


  getDataAboutUs() {

    let ref = 'about_us';

    let aboutUsData = this.firestore
      .collection<any>(ref);


    return aboutUsData.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          }
        );
      }));
  }


  deleteItem(object: string, idItem: string, dialog: MatDialogRef<AlertDialogDelete>) {

    let ref = '';
    switch (object) {
      case 'AC': {
        ref = 'actividades';
        break;
      }
      case 'AG': {
        ref = 'agendas';
        break;
      }
      case 'SL': {
        ref = 'slider';
        break;
      }
      case 'D-ACT': {
        ref = 'detActividad';
        break;
      }
      case 'D-AGE': {
        ref = 'detAgenda';
        break;
      }
    }

    if (ref != '') {
      let actividadesDetalleCollectionRef = this.firestore.collection<any>(ref);
      return actividadesDetalleCollectionRef.doc(idItem).delete();

    }


  }

  getPersons(correo: string) {
    return this.firestore.collection<any>('persons').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          if (data.correo == correo) {
            console.table(data);
            return {id, ...data};
          }
        });
      }));
  }

  getDataContacto() {
    return this.firestore.collection<any>('contacto').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      }));
  }

  getDataAPP() {
    return this.firestore.collection<any>('setting').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};

        });
      }));
  }


  sendMessage(dataForm, toast: ToastrService, clear: void) {
    return this.firestore
      .collection('escritos')
      .add(Object.assign({}, dataForm));

  }

  registrarEscritos(dataForm, apiFirebaseChilds: WebServiceAPIService) {
    return this.firestore
      .collection('escritos')
      .add(Object.assign({}, dataForm));

  }

  editData(docRefID: string, wichObject: string, valueToChange) {
    let db = firebase.firestore();
    let dataUpdate = {};
    switch (wichObject) {
      case 'DIR':
        dataUpdate = {direccion: docRefID};
        break;
      case 'TEL':
        dataUpdate = {telefono: docRefID};
        break;
      case 'EMA':
        dataUpdate = {email: docRefID};
        break;
      case 'ESC':

        dataUpdate = {lEstado: valueToChange};
        break;
    }


    if (wichObject == 'ESC') {
      return db.collection('escritos').doc(docRefID).update(
        dataUpdate
      );
    } else if (wichObject == 'ESC_DOC') {
      dataUpdate = {isDocPrincipal: valueToChange};
      return db.collection('escritosDocumentos').doc(docRefID).update(
        dataUpdate
      );
    } else {
      return db.collection('contacto').doc('data_page').update(
        dataUpdate
      );
    }

  }

  getMessagesContacto() {
    return this.firestore.collection<any>('messages').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};

        });
      }));
  }


  saveDocumento(escritoDocumentos) {
    return this.firestore
      .collection('escritosDocumentos')
      .add(Object.assign({}, escritoDocumentos));
  }

  savePresentates(itemPresentantes) {
    return this.firestore
      .collection('escritosPresentantes')
      .add(Object.assign({}, itemPresentantes));
  }

  saveEstadoEscrito(estadoEscrito) {
    return this.firestore
      .collection('estadoEscrito')
      .add(Object.assign({}, estadoEscrito));
  }

  getDataEscritosDocumentos(idRef: string) {
    return this.firestore.collection<any>('escritosDocumentos', ref => ref.where('idParentFirebase', '==', idRef)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};

        });
      }));
  }

  getSizeEscritosDocumentos(idRef: string) {
    return this.firestore.collection<any>('escritosDocumentos', ref => ref.where('idParentFirebase', '==', idRef)).snapshotChanges().pipe(
      map(actions => {
          return actions.length;
        }
      ));
  }

  getSizeParte(idRef: string) {
    return this.firestore.collection<any>('escritosPresentantes', ref => ref.where('idParentFirebase', '==', idRef)).snapshotChanges().pipe(
      map(actions => {
          return actions.length;
        }
      ));
  }

  deleteDataItem(ref: string, idItem: string) {
    return this.firestore.collection(ref).doc(idItem).delete();
  }

  getDataParteList(idRef: any) {
    return this.firestore.collection<any>('escritosPresentantes', ref => ref.where('idParentFirebase', '==', idRef)).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};

        });
      }));
  }

  verifyData(dataCompare, refColleccion: string) {
    let dataCompareName = '';
    switch (refColleccion) {
      case 'listActoProcesal':
        dataCompareName = 'c_acto_procesal';

        break;
      case 'listTipoMotivo':
        dataCompareName = 'c_motivo_ingreso';

        break;
      case 'registroExpedientes':
        dataCompareName = 'n_unico';
        break;

    }

    console.log('dataCompareName ' + dataCompareName);
    return this.firestore
      .collection<any>(refColleccion, ref => ref.where(dataCompareName, '==', dataCompare)).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
      );


  }

  pushDataItem(dataDB: Object, collecionRef: string = 'registroExpedientes') {
    return this.firestore
      .collection(collecionRef)
      .add(Object.assign({}, dataDB));
  }

  updateDataItem(itemFirebase: any, collecionRef: string = 'registroExpedientes') {
    let db = firebase.firestore();

    return db.collection(collecionRef).doc(itemFirebase.id).update(
      itemFirebase
    );
  }

  getDataInicial(collectionRef) {
    return this.firestore
      .collection<any>(collectionRef).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
      );
  }

  getDatosExpedienteEncontrado(s, nroSala, anio, motivoIngreso) {
    console.log(nroSala + ' ' + anio + ' ' + motivoIngreso);

    return this.firestore
      .collection<any>('registroExpedientes',
        ref =>
          ref.where('c_motivo_ingreso', '==', motivoIngreso)
      ).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
      );
  }
}

//ov1ns
