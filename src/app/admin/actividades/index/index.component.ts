import {Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AlertDialogDelete, DataModal} from '../../../dialogs/dialog-delete/alert-dialog-delete.component';
import {AlertDialogCreate, DataModalCreate} from '../../../dialogs/dialog-create/alert-dialog-create.component';
import {ToastrService} from 'ngx-toastr';
import {DataModalMultiple, DialogMultipleFull} from '../../../dialogs/dialog-full/alert-dialog-create.component';
import {WebServiceAPIService} from '../../../api/web-service-api.service';
import {AlertDialogCreateDetail, DataModalCreateDetail} from '../../../dialogs/dialog-create-detail/alert-dialog-create-detail.component';
import {ActivatedRoute, Router} from '@angular/router';


export class Section {
  checked: boolean;
  id: string;
  titulo: string;
  dsc: string;
  dateRegister: string;
  hideButtonsAdmin: true;
  childList = [];
  recurso: File;
  urlName: string;
  urlDecode: string;
  idParent: string;
}

export interface SectionChild {
  idChild: string;
  selected: boolean;
  url: string;
  updated: string;
  idParent: string;
}

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  animal: string;
  name: string;

  actividadListIndex: Section[] = [];
  actividadSelectedList: Section[] = [];
  private actividadListDB: Section[] = [];
  isCheckedAllACtividad = false;
  panelOpenState: boolean;

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  agendaListIndex: Section[] = [];
  agendaSelectedList: Section[] = [];
  private agendaListDB: Section[] = [];

  constructor(public dialog: MatDialog,
              private toastr: ToastrService,
              private api: WebServiceAPIService,
              private route: ActivatedRoute,
              private router: Router,) {
  }


  ngOnInit(): void {


    this.route.params.subscribe((params) => {
      // const id = Number.parseInt(params['idAct']);
      const token = params['token'].split('_');


      if ('Kv88m3B3JJMMFkLyPHHoPcXMqp92' == token) {
        this.showSuccess('Bienvenido', 'Success');
        this.getActividadesWS();
        this.getAgendasWS();
      } else {
        this.toastr.error('No Puede Hacer Esto', 'Error');
      }
    });


  }

  getActividadesWS = () =>
    this.api.getEscritosList().subscribe(res => {
        this.actividadListDB = [];
        console.table(res);
        res.forEach(item => {

          console.log(item);

          let actividad = new Section;
          actividad.id = item.id;
          actividad.titulo = item.titulo;
          actividad.dsc = item.dsc;
          actividad.urlDecode = item.urlDecode;
          actividad.urlName = item.urlName;
          actividad.dateRegister = item.dateRegister;
          this.actividadListDB.push(actividad);
          this.api.getDetalle(item.id, 'D-ACT').subscribe((res: any[]) => {
            res.forEach(itemDB => {
              if (itemDB.idParent == item.id) {
                actividad.childList.push(itemDB);
              }
            });
          }, (error) => {
          });

        });
        this.setupPaginator('AC');
      }
    );

  getAgendasWS = () =>
    this.api.getAgendas().subscribe(res => {
        this.agendaListDB = [];
        // console.table(res);
        res.forEach(item => {
          let agenda = new Section;
          agenda.id = item.id;
          agenda.titulo = item.titulo;
          agenda.dsc = item.dsc;
          agenda.dateRegister = item.dateRegister;
          this.agendaListDB.push(agenda);
          this.api.getDetalle(item.id, 'D-AGE').subscribe((res: any[]) => {
            res.forEach(itemDB => {
              if (itemDB.idParent == item.id) {
                agenda.childList.push(itemDB);
              }
            });
          }, (error) => {
          });


        });
        this.setupPaginator('AG');
      }
    );


  private setupPaginator(wichList: string) {
    if (wichList == 'AC') {
      this.actividadListIndex = [];
      this.actividadListDB.forEach((item, index) => {
        if (index <= this.pageSizeActividad) {
          this.actividadListIndex.push(item);
        }
      });
    } else {
      this.agendaListIndex = [];
      this.agendaListDB.forEach((item, index) => {
        if (index <= this.pageSizeAgenda) {
          this.agendaListIndex.push(item);
        }
      });
    }


  }

  showSuccess(message, titlle) {
    this.toastr.success(message, titlle);
  }

  setHidebutonAdmin(isHideButtons: boolean, folderItem): void {
    // if (this.isCheckedAll) {
    //   folderItem.hideButtonsAdmin = false;
    // } else {
    //   folderItem.hideButtonsAdmin = isHideButtons;
    //
    // }
  }


  onAuxClickListener(item: Section, postition: number): void {
    // alert(`${item.name} ${postition} Clicked `);
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event): void {
    event.preventDefault();
  }

  setChangeAllSeleccionListenesr(checked: boolean, wichCheck: string): void {

    if (wichCheck == 'AC') {
      this.isCheckedAllACtividad = checked;
      if (this.isCheckedAllACtividad) {
        this.actividadListIndex.forEach(item => {
          item.checked = true;
          this.setHidebutonAdmin(false, item);
          if (this.activdadSelectedList.find((test) => test.id === item.id) === undefined) {
            this.activdadSelectedList.push(item);
          }
        });
      } else {
        this.actividadListIndex.forEach(item => {
          item.checked = false;
          this.setHidebutonAdmin(true, item);
        });
        this.activdadSelectedList = [];
      }
    } else {
      this.isCheckedAllAgenda = checked;
      if (this.isCheckedAllAgenda) {
        this.agendaListIndex.forEach(item => {
          item.checked = true;
          this.setHidebutonAdmin(false, item);
          if (this.agendaSelectedList.find((test) => test.id === item.id) === undefined) {
            this.agendaSelectedList.push(item);
          }
        });
      } else {
        this.agendaListIndex.forEach(item => {
          item.checked = false;
          this.setHidebutonAdmin(true, item);
        });
        this.agendaSelectedList = [];
      }

    }


  }

  setChangeItemListenesr(checked: boolean, itemSelected: Section, postition: number): void {
    itemSelected.checked = checked;
    if (checked) {
      if (this.activdadSelectedList.find((test) => test.id === itemSelected.id) === undefined) {
        this.activdadSelectedList.push(itemSelected);
      }
    } else {
      itemSelected.checked = false;
      if (!itemSelected.checked) {
        this.activdadSelectedList.splice(this.activdadSelectedList.findIndex(x => x.id === itemSelected.id), 1);
      }
    }
  }

  removeItem(folder: Section, postition: number, typeObject: string): void {
    this.openDialogDelete(postition, folder, typeObject);
  }


  openDialogDelete(postition: number, folder: Section, typeObject: string): void {
    const dialogo1 = this.dialog.open(AlertDialogDelete, {
      data: new DataModal(
        'Eliminar Actividad', 'Esta seguro que quiere eliminar esta actividad?', typeObject, folder)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result == 'Deleted') {
        // this.actividadListIndex.splice(this.actividadListIndex
        //   .findIndex(x => x.id === folder.id), 1);
      }
    });
  }

  activdadSelectedList = [];

  removeAllItems(wichList: string): void {
    if (wichList == 'AC') {
      this.removeAll(this.isCheckedAllACtividad, this.actividadListIndex, this.activdadSelectedList);
    } else {
      this.removeAll(this.isCheckedAllAgenda, this.agendaListIndex, this.agendaSelectedList);
    }
  }

  private removeAll(checked: boolean, listIndex: Section[], SelectedList: any[]) {
    checked = false;
    listIndex.forEach(item => {
      listIndex.splice(SelectedList
        .findIndex(x => x.id === item.id), 1);
    });
    SelectedList = [];
  }

  showCreateDialog(wichObject: string) {

    let titleCreation: string;
    if (wichObject == 'AC') {
      titleCreation = 'Actividad';
    } else if (wichObject == 'AG') {
      titleCreation = 'Agenda';
    } else if (wichObject == 'SL') {
      titleCreation = 'slider';
    }


    const dialogo1 = this.dialog.open(AlertDialogCreate, {
      data: new DataModalCreate('Registrar Elemento : ' + titleCreation, wichObject)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result == 'CR_AG') {

      } else if (result == 'CR_AC') {//CR=CREATE

      } else {

      }
    });
  }

  showModalImage(url: string) {
    const dialogo1 = this.dialog.open(DialogMultipleFull, {
      panelClass: 'app-full-bleed-dialog',
      data: new DataModalMultiple(url, null),
    });
    dialogo1.afterClosed().subscribe(result => {
      // if (result == 'CR') {//CR=CREATE
      //   alert('CREATED');
      // } else {
      //   alert('CANCELED');
      // }
    });
  }

  pageSizeActividad = 10;
  pageSizeAgenda = 10;
  isCheckedAllAgenda = false;
  listDetalleActividad = [];
  listDetalleAgenda = [];

  getActividadesByPageSize(wichList: string) {
    // this.pageSize;
    this.setupPaginator(wichList);
  }

  showCreateDetailDialog(wichObject: string, idParent: string) {
    let titleCreation = (wichObject == 'D_ACT') ? 'Actividad' : 'Agenda';


    const dialogo1 = this.dialog.open(AlertDialogCreateDetail, {
      data: new DataModalCreateDetail('Registrar Parrafo : ' + titleCreation, wichObject, idParent)
    });
    dialogo1.afterClosed().subscribe(result => {
      // if (result == 'CR_AG') {
      //
      // } else if (result == 'CR_AC') {//CR=CREATE
      //
      // } else {
      //
      // }
    });
  }
}




