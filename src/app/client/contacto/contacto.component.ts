import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {WebServiceAPIService} from '../../api/web-service-api.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private api: WebServiceAPIService
  ) {
  }

  listDetalle = [];
  contactoData = {
    titulo: 'CONTACTANOS',
    details: '',
    urlDecode: './assets/poder-juicial.png'
  };
  dataForm = {
    msj: '',
    correo: '',
    apellidos: '',
    nombres: ''
  };
  isDisabledEnviar = false;
  dataContancto = {};

  ngOnInit(): void {

    this.api.getDataContacto().subscribe((res: any[]) => {
      res.forEach(item => {
        if (item.id == 'data_page') {
          this.dataContancto = item;
        }
      });
    }, (error) => {
    });


  }

  onClickSendForm() {
    this.Errors = 0;
    this.isDisabledEnviar = true;
    this.validarInputs(this.dataForm.nombres, 'Nombres');
    this.validarInputs(this.dataForm.apellidos, 'apellidos');
    this.validarInputs(this.dataForm.msj, 'Mensaje');
    this.validarInputs(this.dataForm.correo, 'Correo');

    if (this.Errors == 0) {
      this.enviarMensaje();
    } else {
      this.isDisabledEnviar = false;
    }

  }


  Errors = 0;

  private validarInputs(valueText: string, inputName: string) {
    if (valueText == '') {
      this.Errors++;
      this.toastr.warning('Debe Escribir el campo ' + inputName);
    }
  }


  private enviarMensaje() {
    let toast = this.toastr;
    let data = this.dataForm;
    this.api.sendMessage(data, toast)
      .then(function(docRef) {
        toast.success('Mensaje Enviado Correctamente');
        data.nombres = '';
        data.apellidos = '';
        data.msj = '';
        data.correo = '';

      })
      .catch(function(error) {
        // The document probably doesn't exist.
        console.error('Error updating document: ', error);
      });


    // if (success) {
    //   this.clearInputs();
    // }
  }

  private clearInputs() {

  }
}


