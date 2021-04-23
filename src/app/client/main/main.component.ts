import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {ToastrService} from 'ngx-toastr';
import {AngularFireStorage} from '@angular/fire/storage';
import {BreakpointObserver} from '@angular/cdk/layout';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AlertDialogDelete, DataModal} from '../../dialogs/dialog-warning/alert-dialog-delete.component';
import {MatDialog} from '@angular/material/dialog';
import {DataModalMultiple, DialogMultipleFull} from '../../dialogs/dialog-full/alert-dialog-create.component';
import {getRouterModuleDeclaration} from '@schematics/angular/utility/ast-utils';
import {ActivatedRoute, RouterModule} from '@angular/router';


/** Constants used to fill up our data base. */
const COLORS: string[] = [
  'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
  'aqua', 'blue', 'navy', 'black', 'gray'
];
const NAMES: string[] = [
  'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
  'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})


export class MainComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'progress', 'color', 'color2', 'estado', 'options'];
  dataTable: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  actividadesList: any[];

  constructor(private toastr: ToastrService,
              private apiFirebase: WebServiceAPIService,
              private breakpointObserver: BreakpointObserver,
              private dialog: MatDialog,
              private route: ActivatedRoute,
  ) {


    // Assign the data to the data source for the table to render


  }


  ngOnInit(): void {
    this.getEscritosWS();

  }

  ngAfterViewInit() {
    // this.dataTable.paginator = this.paginator;
    // this.dataTable.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataTable.filter = filterValue.trim().toLowerCase();

    if (this.dataTable.paginator) {
      this.dataTable.paginator.firstPage();
    }
  }

  /** Builds and returns a new User. */
  createNewUser(id: number): UserData {
    const name = NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: id.toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }


  getEscritosWS = () =>
    this.apiFirebase
      .getEscritosList()
      .subscribe(res => {
          let rowNumber = 1;
          res.forEach(item => {
            item['rowNumber'] = rowNumber++;
            item['estadoValue'] = MainComponent.getEstado(item.lEstado, 'val');
            // item['countDocuments'] = this.getSizeOfList(item.id, 'escritosDocumentos');
            // item['countPresentantes'] = this.getSizeOfList(item.id, 'escritosPresentantes');
          });


          // this.dataTable = new MatTableDataSource(Array.from({length: 100}, (_, k) => this.createNewUser(k + 1)));
          // this.dataTable = new MatTableDataSource(Array.from({length: res.length}, ((item, k) => res[k])));
          this.dataTable = new MatTableDataSource(res);

        }
      );

  getSizeOfList(id: any, refList: string): number {
    let size = 0;
    if (refList == 'escritosDocumentos') {
      this.apiFirebase.getSizeEscritosDocumentos(id).subscribe(
        resp => {
          size = resp;
        }
      );
    } else {
      this.apiFirebase.getSizeParte(id).subscribe(
        resp => {
          size = resp;
        }
      );
    }
    return size;
  }

  private static getEstado(estadoID: string, typeGet = 'col'): string {
    let value = '';
    let color = '';
    switch (estadoID) {
      case 'RE':
        value = 'REGISTRADO';
        break;
      case 'EN':
        value = 'ENVIADO';
        break;
      case 'EL':
        value = 'ELIMINADO';
        break;
    }
    if (typeGet == 'val') {
      return value;
    } else {
      return color;
    }
  }


//asdkadf

  onClickEnviarDocumentoListener(row: any) {
    this.apiFirebase.editData(row.id, 'ESC', 'EN')
      .then(res => {
        this.toastr.success('DOCUMENTO ENVIADO');
      })
      .catch(error => {

      });
  }

  onClickEditarDocumentoListener(row: any) {
    this.openDialogEdit(row.rowNumber, row, 'ASD');
  }


  openDialogEdit(postition: number, itemEscrito: any, typeObject: string): void {


    const dialogo1 = this.dialog.open(DialogMultipleFull, {
      data: new DataModalMultiple(
        'EDITAR DOCUMENTOS ADJUNTOS', itemEscrito,)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result == 'E_EDITED') {

      }
    });
  }

  onClickImprimirDocumentoListener(row: any) {
    // alert('Clickled');

    // let dataRecurso = row.recurso.split(' ');
    // let MotivoIngreso = dataRecurso[0];
    // let Sala = dataRecurso[0];
    // let Anio = dataRecurso[0];
    let data = {
      recurso: row.recurso,
      sala: row.instancia,
      fecha: row.fechaIngreso,
      folios: row.n_fojas,
      cantd: row.cantDoc,
      documento: row.docPrincipalName,
      prestante: row.presentante0,
      cod_documento: `${row.id}_${new Date(row.fechaIngreso).getFullYear()}`,

    };

    localStorage.setItem('printFile', JSON.stringify(data));

    window.open('/print', '_popupComponentRef');
  }
}
