import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-impresion-documento',
  templateUrl: './impresion-documento.component.html',
  styleUrls: ['./impresion-documento.component.css']
})
export class ImpresionDocumentoComponent implements OnInit {

  data = {
    recurso: '',
    sala: '',
    fecha: '',
    folios: '',
    cantd: '',
    documento: '',
    prestante: '',
    cod_documento: '',

  };


  constructor() {
  }

  ngOnInit(): void {

    this.data = JSON.parse(localStorage.getItem('printFile'));


    window.print();
    window.onafterprint = function() {
      console.log('Printing completed...');
      window.close();
    };
  }

}
