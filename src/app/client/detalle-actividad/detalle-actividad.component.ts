import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {Section} from '../../admin/actividades/index/index.component';

@Component({
  selector: 'app-detalle-actividad',
  templateUrl: './detalle-actividad.component.html',
  styleUrls: ['./detalle-actividad.component.css']
})
export class DetalleActividadComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: WebServiceAPIService
  ) {
  }

  listDetalle = [];

  ngOnInit(): void {


    this.route.params.subscribe((params) => {
      // const id = Number.parseInt(params['idAct']);
      const paramsGlobal = params['token'];

      let id = paramsGlobal[0];
      let tyObject = paramsGlobal[1];

      // alert(id);
      console.table('id :', id);


      this.api.getDetalle(id, tyObject).subscribe((res: any[]) => {
        // if (res['id'] != null) {
        res.forEach(item => {
          // let ref = (tyObject == 'D-ACT') ? 'detActividad' : 'detAgenda';


          if (item.idParent == id) {
            console.table(item);
            this.listDetalle.push(item);
          }
        });

      }, (error) => {
      });
    });

  }
}


