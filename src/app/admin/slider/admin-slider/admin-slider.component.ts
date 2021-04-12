import {Component, OnInit} from '@angular/core';
import {WebServiceAPIService} from '../../../api/web-service-api.service';
import {Section} from '../../actividades/index/index.component';
import {AlertDialogDelete, DataModal} from '../../../dialogs/dialog-warning/alert-dialog-delete.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-admin-slider',
  templateUrl: './admin-slider.component.html',
  styleUrls: ['./admin-slider.component.css']
})
export class AdminSliderComponent implements OnInit {
  slides = [];

  constructor(public dialog: MatDialog, private service: WebServiceAPIService) {
  }

  ngOnInit(): void {
    this.getSliderWS();
  }


  getSliderWS = () =>
    this.service.getSliders().subscribe(res => {
        this.slides = [];
        // console.table(res);
        res.forEach(item => {
          this.slides.push(item);
        });

      }
    );

  removeImg(row: number, slide: any, sl: string) {
    this.openDialogDelete(row, slide, sl);

  }

  openDialogDelete(postition: number, folder: Section, typeObject: string): void {
    const dialogo1 = this.dialog.open(AlertDialogDelete, {
      data: new DataModal(
        'Eliminar Imagen', 'Esta seguro que quiere eliminar esta Imagen?', typeObject, folder)
    });
    dialogo1.afterClosed().subscribe(result => {
      if (result == 'Deleted') {

      }
    });
  }
}
