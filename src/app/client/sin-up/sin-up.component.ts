import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {User, WSAuthService} from '../../api/ws-api_mpartes.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material/dialog';
import {DataModalMultiple, DialogMultipleFull} from '../../dialogs/dialog-full/alert-dialog-create.component';
import {FormItem} from './form.item';
import {INPUTS_IDS} from './INPUTS_IDS';
import {TEXT_RESOURCE} from '../../utils/text-resource.enum';

@Component({
  selector: 'app-sin-up',
  templateUrl: './sin-up.component.html',
  styleUrls: ['./sin-up.component.css']
})
export class SinUpComponent implements OnInit {
  dataForm = {
    nombres: '',
    postalCode: '',
    estado: '',
    pais: '',
    direccion2: '',
    direccion1: '',
    apellidos: '',
    nroDocumento: '',
    correo: '',
    password: '',
    seledtValue: ''

  };

  constructor(
    public afs: AngularFirestore,
    private toastr: ToastrService,
    private apiAuth: WSAuthService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) {
  }


  ngOnInit(): void {

    let SEL_TIPODOC = [];
    SEL_TIPODOC.push({value: '001', viewValue: 'DNI'});
    SEL_TIPODOC.push({value: '002', viewValue: 'PASSAPORTE'});
    SEL_TIPODOC.push({value: '003', viewValue: 'CEDULA'});

    let SEL_COLEGIOABO = [];
    SEL_COLEGIOABO.push({value: '001', viewValue: 'LIMA'});
    SEL_COLEGIOABO.push({value: '002', viewValue: 'ANCASH'});
    SEL_COLEGIOABO.push({value: '003', viewValue: 'HUANCAYO'});

    let SEL_TIPOPERSONA = [];
    SEL_TIPOPERSONA.push({value: '001', viewValue: 'NATURAL'});
    SEL_TIPOPERSONA.push({value: '002', viewValue: 'JURIDICA'});


    this.formsList.push(
      new FormItem(true, INPUTS_IDS.APELLIDO_PAT, 'APELLIDO PATERNO', '', '', 'text', null),
      new FormItem(true, INPUTS_IDS.APELLIDO_MAT, 'APELLIDO MATERNO', '', '', 'text', null),
      new FormItem(true, INPUTS_IDS.NOMBRES, 'NOMBRES', '', '', 'text', null),
      new FormItem(true, INPUTS_IDS.TIPO_DOC, 'TIPO DOCUMENTO ', '', '', 'SEL', SEL_TIPODOC),
      new FormItem(true, INPUTS_IDS.TIPO_DOC_VALUE, 'Nro DOCUMENTO ', '', '', 'text', null),
      new FormItem(true, INPUTS_IDS.F_NACIMIENTO, 'FECHA NACIMIENTO', '', '', 'date', null),
      new FormItem(true, INPUTS_IDS.TELEFONO, 'TELEFONO', '', '', 'tel', null),
      new FormItem(true, INPUTS_IDS.COLEGIO_ABOGADO, 'COLEGIO DE ABOGADOS', '', '', 'SEL', SEL_COLEGIOABO),
      new FormItem(true, INPUTS_IDS.TIPO_PERSONA, 'TIPO PERSONA', '', '', 'SEL', SEL_TIPOPERSONA),
      new FormItem(true, INPUTS_IDS.NRO_COLEGIO_ABOG, 'NRO` COLEGITURA', '', '', 'text', null),
      new FormItem(false, INPUTS_IDS.SINOE, 'CASILLA SINOE', '', '', 'text', null),
      new FormItem(true, INPUTS_IDS.EMAIL, 'CORREO', '', '', 'mail', null),
      new FormItem(true, INPUTS_IDS.USERNAME, 'USUARIO ', '', '', 'text', null),
      new FormItem(true, INPUTS_IDS.CLAVE, 'CLAVE', '', '', 'text', null),
    );


  }

  onClickSendForm(): void {
    // this.isDisabledEnviar = true;
    this.errorForms = 0;
    this.validarAllImouts();

    this.registerUserData();
  }

  private registerUserData() {
    let email = this.getValueOfForm(this.formsList, INPUTS_IDS.EMAIL);
    let password = this.getValueOfForm(this.formsList, INPUTS_IDS.CLAVE);
    if (this.errorForms == 0) {
      this.executeUseCase(email, password);
    }
  }

  private getValueOfForm(formsList: FormItem[], inputID) {
    let formData = formsList.find(item => item.inputName == inputID);
    return formData.value;
  }

  private executeUseCase(email: string, password: string) {
    if (this.errorForms == 0) {
      this.apiAuth.SignUp(email, password)
        .then((resul) => {

          console.log(resul.user);
          this.clearValuesInputs();
          this.isDisabledEnviar = false;
          this.toastr.success(`Registrado`, 'ACCION COMPLETADA', {
            timeOut: 3000
          });
          this.SetUserData(resul.user);
        }, error => {
          this.isDisabledEnviar = false;

          this.toastr.error(` ${error}`, 'ERROR DE CONEXION');
        });
    } else {
      this.isDisabledEnviar = false;
    }
  }

  SetUserData(user) {
    const userData: User = {
      idAut: user.uid,
      email: user.email,
      displayName: this.getValueOfForm(this.formsList, INPUTS_IDS.USERNAME),
      photoURL: user.photoURL,
      emailVerified: false,
      apellidoPaterno: this.getValueOfForm(this.formsList, INPUTS_IDS.APELLIDO_PAT),
      apellidoMaterno: this.getValueOfForm(this.formsList, INPUTS_IDS.APELLIDO_MAT),
      nombres: this.getValueOfForm(this.formsList, INPUTS_IDS.NOMBRES),
      tipoDoc: this.getValueOfForm(this.formsList, INPUTS_IDS.TIPO_DOC),
      tipoDocValue: this.getValueOfForm(this.formsList, INPUTS_IDS.TIPO_DOC_VALUE),
      fechaNacimiento: this.getValueOfForm(this.formsList, INPUTS_IDS.F_NACIMIENTO),
      telefono: this.getValueOfForm(this.formsList, INPUTS_IDS.TELEFONO),
      colegioAbogado: this.getValueOfForm(this.formsList, INPUTS_IDS.COLEGIO_ABOGADO),
      nroColegioAbo: this.getValueOfForm(this.formsList, INPUTS_IDS.NRO_COLEGIO_ABOG),
      sinoe: this.getValueOfForm(this.formsList, INPUTS_IDS.SINOE),
      tipoPersona: this.getValueOfForm(this.formsList, INPUTS_IDS.TIPO_PERSONA),

    };
    this.apiAuth.SetUserData(userData).then(
      response => {
        this.router.navigate(['/main']);
      }
    )
      .catch(
        error => {
          this.toastr.error(error.getMessage());
        }
      );
  }

  private clearValuesInputs() {

    this.dataForm.correo = '';
    this.dataForm.nombres = '';
    this.dataForm.pais = '';
    this.dataForm.apellidos = '';
    this.dataForm.nroDocumento = '';
    this.dataForm.direccion1 = '';
    this.dataForm.seledtValue = '';
  }

  private validarAllImouts() {
    this.validateTerminos(this.valueCBX);
    this.formsList.forEach(item => {
      if (item.isRequired) {
        this.validateInputs(item.value, item.label);
      }
    });


  }

  errorForms = 0;

  private validateInputs(valueText: string, inputName: string) {
    if (valueText == '') {
      this.errorForms++;
      this.toastr.warning(`${TEXT_RESOURCE.SINGUP_VALIDAR_INPUTS_ALERT_MESSAGE} ${inputName}`, TEXT_RESOURCE.SINGUP_VALIDAR_INPUTS_ALERT_TITULO);
    }

  }

  isDisabledEnviar = false;
  formsList = Array<FormItem>();

  onClickAuthGoogle() {
    this.errorForms = 0;
    this.validateTerminos(this.valueCBX);
    if (this.errorForms == 0) {
      this.apiAuth.GoogleAuth()
        .then((result) => {
          console.table(result);


          this.SetUserData(result.user);


        }).catch((error) => {

        // window.alert(error);
      });
    }

  }

  valueCBX = false;

  onChangeCondition(checked: boolean, event) {
    if (checked == true) {
      this.valueCBX = true;
      const dialogo1 = this.dialog.open(DialogMultipleFull, {
        data: new DataModalMultiple(
          'TERMINOS', null)
      });
      dialogo1.afterClosed().subscribe(result => {
        if (result != 'ACEPTAR') {
          this.valueCBX = false;
        }
      });
    }
  }

  private validateTerminos(valueCBX: boolean) {
    if (valueCBX == false) {
      this.toastr.error(`ACEPTAR LOS TERMINOS Y CONDICIONES`);
      this.errorForms++;
    }
  }
}


