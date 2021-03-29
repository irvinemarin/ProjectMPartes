import {Component, OnInit} from '@angular/core';
import {Section} from '../../admin/actividades/index/index.component';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {ToastrService} from 'ngx-toastr';
import {AngularFireStorage} from '@angular/fire/storage';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  title = 'AnProyecto02';
  slides = [];


  valueTextButton = 'Leer más';
  actividadesList: Section[];
  agendaList: Section[];



  constructor(private toastr: ToastrService,
              private service: WebServiceAPIService,
              private afStorage: AngularFireStorage,
              private breakpointObserver: BreakpointObserver
  ) {
  }

  ngOnInit(): void {
    this.getActividadesWS();
    this.getAgendasWS();
    this.getSliderWS();
    // this.countItemsAgenda = (window.innerWidth <= 400) ? 1 : 4;
    // this.rowHeigthActividad = (window.innerWidth <= 400) ? '1:3.6' : '1:1.2';
    // this.rowHeigthAgenda = (window.innerWidth <= 400) ? '1:3.6' : '1:1.2';
    // this.PropottionAgenda = (window.innerWidth <= 400) ? 90 : 30;
    // this.proportionActividad = (window.innerWidth <= 400) ? 90 : 30;
    // this.detectBreakpoint();

  }


  getActividadesWS = () =>
    this.service
      .getActividades()
      .subscribe(res => {
          this.actividadesList = [];
          res.forEach(item => {
            let actividad = new Section;
            actividad.id = item.id;
            actividad.titulo = item.titulo;
            actividad.dsc = item['dsc'];
            actividad.dateRegister = item['dateRegister'];
            actividad.urlName = item.urlName;
            actividad.urlDecode = item.urlDecode;
            this.actividadesList.push(actividad);
          });

          // this.calculateDataSlider('AC');

        }
      );

  getAgendasWS = () =>
    this.service
      .getAgendas()
      .subscribe(res => {

          this.agendaList = [];
          res.forEach(item => {
            let actividad = new Section;
            actividad.id = item.id;
            actividad.titulo = item.titulo;
            actividad.dsc = item['dsc'];
            actividad.dateRegister = item['dateRegister'];
            actividad.urlName = item.urlName;
            actividad.urlDecode = item.urlDecode;
            this.agendaList.push(actividad);
          });

          this.calculateDataSlider('AG');


        }
      );

  private calculateDataSlider(typeObject: string) {
    let length = 0;
    let divisor = 0;
    let sliderCount = 0;
    length = typeObject == 'AG' ? this.agendaList.length : this.actividadesList.length;
    divisor = typeObject == 'AG' ? this.countItemsAgenda : this.colsItemsActividad;
    // let resto = this.agendaList.length % 4;
    let cociente = Math.round(length / divisor);
    // let resto = 18 % 4;
    // let decimal = cociente - Math.floor(cociente);
    if (cociente == 0) {
      cociente++;
    }
    (typeObject == 'AG') ? this.sliderCountAgenda = cociente : this.sliderCountActividad = cociente;
  }

  showSuccess(message, titlle) {
    this.toastr.success(message, titlle);
  }

  sliderCountActividad = 3;
  sliderCountAgenda = 0;

  //method to retrieve download url
  countItemsAgenda = 4;
  colsItemsActividad = 3;
  rowHeigthActividad: any;
  rowHeigthAgenda: any;
  PropottionAgenda: any;
  proportionActividad: any;
  gridRowsSpan: any;
  gridColsSpan: any;


  getSliderWS = () =>
    this.service.getSliders().subscribe(res => {
        this.slides = [];
        // console.table(res);
        res.forEach(item => {
          this.slides.push(item);
        });

      }
    );

}
