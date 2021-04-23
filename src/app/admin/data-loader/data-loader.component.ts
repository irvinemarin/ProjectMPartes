import {Component, OnInit} from '@angular/core';
import {JavaApiService} from '../../api/api_java/java-api.service';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {count} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

export class TableInfo {
  tableName: string;
  countItem: number;
}

@Component({
  selector: 'app-data-loader',
  templateUrl: './data-loader.component.html',
  styleUrls: ['./data-loader.component.css']
})
export class DataLoaderComponent implements OnInit {


  constructor(
    private javaWS: JavaApiService,
    private toastr: ToastrService,
    private apiFirebase: WebServiceAPIService
  ) {
  }

  ngOnInit(): void {

  }

  actualizados = 0;
  nuevos = 0;
  proggres = {
    hideProgress: true,
    valueInfo: '',
    proggres: 0,
    tableInfoList: Array<TableInfo>()
  };


  onActualizarDatosClickListener() {
    this.proggres.hideProgress = false;
    this.proggres.valueInfo = '';
    this.actualizados = 0;
    this.nuevos = 0;
    this.proggres.tableInfoList = [];

    let count = 0;
    let callback = this.javaWS.getAllDataExpdientes().subscribe(
      response => {

        count = 0;
        let listExpedientes = response['listExpediente'];
        this.proggres.valueInfo += `Actualizando Tablas Expedientes`;
        let itemTableInfo = new TableInfo();
        itemTableInfo.tableName = 'Expedientes';
        listExpedientes.forEach(itemDB => {
          this.validateData(itemDB, 'EX');
          count++;
          this.proggres.proggres = 40;
          itemTableInfo.countItem = count;
        });
        this.proggres.tableInfoList.push(itemTableInfo);


        count = 0;
        let tipoMotivo = [], listActoProcesal = [];
        tipoMotivo = response['listTipoMotivo'];
        listActoProcesal = response['listActoProcesal'];

        this.proggres.valueInfo = 'Actualizado Tablas Maestras Tipo Motivo';
        let itemTableInfo2 = new TableInfo();
        itemTableInfo2.tableName = 'Tipo Motivo';
        tipoMotivo.forEach(itemDB => {
          this.validateData(itemDB, 'TM');
          count++;
          this.proggres.proggres = 70;
          itemTableInfo2.countItem = count;

        });
        this.proggres.tableInfoList.push(itemTableInfo2);


        count = 0;
        this.proggres.valueInfo = 'Actualizado Tablas Maestras Acto Procesal';
        let itemTableInfo3 = new TableInfo();
        itemTableInfo3.tableName = ' Acto Procesal';

        listActoProcesal.forEach(itemDB => {
            this.validateData(itemDB, 'AP');
            count++;
            this.proggres.proggres = 100;
            itemTableInfo3.countItem = count;
          }
        );
        this.proggres.tableInfoList.push(itemTableInfo3);
      },
      error => {

      });


  }


  private validateData(itemDB, typeData: string) {

    // alert('validate ' + JSON.stringify(itemDB));
    if (typeData == 'EX') {
      this.apiFirebase.verifyData(itemDB.n_unico, 'registroExpedientes').subscribe(
        response => {
          if (response.length == 0) {
            this.insertarItemExpediente(itemDB);
          }
        },
        error => {
          alert(error);
        },
      );
    } else if (typeData == 'AP') {
      this.apiFirebase.verifyData(itemDB.c_acto_procesal, 'listActoProcesal').subscribe(
        response => {
          if (response.length == 0) {
            this.insertarItemDataMaestra(itemDB, 'listActoProcesal');
          }
        }, error => {
          alert(error);
        },
      );


    } else if (typeData == 'TM') {
      this.apiFirebase.verifyData(itemDB.c_motivo_ingreso, 'listTipoMotivo').subscribe(
        response => {
          if (response.length == 0) {
            this.insertarItemDataMaestra(itemDB, 'listTipoMotivo');
          }
        }, error => {
          alert(error);
        },
      );
    }


  }

  private insertarItemExpediente(itemDB) {
    this.apiFirebase.pushDataItem(itemDB)
      .then(
        () => {
          this.nuevos++;
          this.toastr.success('datos registrado registroExpediente');

          ;
        }
      )
      .catch(error => {
          this.toastr.error(error);

        }
      );
  }

  private updateItemExpediente(itemFirebase: any) {
    let callback = this.apiFirebase.updateDataItem(itemFirebase)
      .then(
        () => {
          // this.toastr.success('Cambios Guardados');
        }
      )
      .catch(error => {
          this.toastr.error(error);

        }
      );
  }


  private insertarItemDataMaestra(itemDB, collecionRef: string) {
    this.apiFirebase.pushDataItem(itemDB, collecionRef)
      .then(() => {
          this.toastr.success('datos registrado ' + collecionRef);
        }
      )
      .catch(error => {
          this.toastr.error(error);

        }
      );
  }

  // private updateItemDataMaestra(itemFirebase: any, collecionRef: string) {
  //   let callback = this.apiFirebase.updateDataItem(itemFirebase)
  //     .then(
  //       () => {
  //         // this.toastr.success('Cambios Guardados');
  //       }
  //     )
  //     .catch(error => {
  //         this.toastr.error(error);
  //
  //       }
  //     );
  // }
  hideProgress = true;
}
