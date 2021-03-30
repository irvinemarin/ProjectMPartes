import {Component, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {WSAuthService} from '../api/ws-api_mpartes.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form = {
    labelUsername: 'EMAIL',
    labelPassword: 'CLAVE',
    labelCode: 'CODIGO SEGURIDAD',
    valueUsername: '',
    hintUsername: 'Ingrese su EMAIL',
    hintPassword: 'Ingrese su Clave',
    valuePassword: '',
    valueCode: '',
    hintCode: 'Ingrese el codigo',
    codeGenerated: '',
    disableBtnIngresar: false

  };

  constructor(
    private toastr: ToastrService,
    private api: WSAuthService,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.createCodeCanvas();
  }

  createCodeCanvas() {
    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.form.codeGenerated = result;
    let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('divCanvas');
    canvas.width = 80;
    canvas.height = 60;
    let ctx = canvas.getContext('2d');
    ctx.font = '15px Arial';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'red';
    ctx.fillText(result, 13, 22);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#9b5656';
    ctx.beginPath();
    ctx.moveTo(10, 42);
    ctx.lineTo(30, 12);
    ctx.moveTo(60, 32);
    ctx.lineTo(15, 20);
    ctx.moveTo(40, 42);
    ctx.lineTo(60, 12);
    ctx.stroke();
    ctx.closePath();

  }

  onIngresarClicked() {
    this.errorImputs = 0;
    this.form.disableBtnIngresar = true;
    this.validateFormValuesEmpty(this.form.valueUsername, 'USUARIO');
    this.validateFormValuesEmpty(this.form.valuePassword, 'CLAVE');
    this.validateFormValuesEmpty(this.form.valueCode, 'CODIGO');
    this.compareCode();
    if (this.errorImputs == 0) {
      this.validateUserFromDB();
    } else {
      this.reloadCode();
      this.clearInputs();
      this.form.disableBtnIngresar = false;

    }

  }

  private clearInputs() {
    this.form.valueUsername = '';
    this.form.valuePassword = '';
    this.form.valueCode = '';
  }

  private validateUserFromDB() {
    this.toastr.success('Usuario Correcto');

    this.api.SignIn(this.form.valueUsername, this.form.valuePassword)
      .then((result) => {
        console.table(result);
      }).catch((error) => {
      window.alert(error.message);
    });
  }

  private compareCode() {
    if (this.form.codeGenerated.toUpperCase() != this.form.valueCode.toUpperCase()) {
      this.errorImputs++;
      this.toastr.error('Codigo Ingresado NO es correcto');
    }
  }

  errorImputs = 0;

  private validateFormValuesEmpty(valueCode: string, inputName: string) {
    if (valueCode == '') {
      this.errorImputs++;
      this.toastr.warning(`Ingrese el texto para ${inputName}`);
    }
  }

  reloadCode() {
    this.createCodeCanvas();
  }

  onClickAuthGoogle() {
    this.api.GoogleAuth()
      .then((result) => {
        this.api.getUserData(result.user.uid)
          .subscribe(result => {
              if (result.length > 0) {
                // alert('bienvenido ' + result[0].nombres);
                this.toastr.success('Bienvenido...');
                window.location.replace('/main');
              } else {
                this.toastr.error('Usuario NO Registrado');
              }
            }
            , error => {
              alert('ERROR');
            }
          )

        ;
        this.api.SetUserData(result.user).then(r => {
        });
      }).catch((error) => {

      // window.alert(error);
    });
  }
}
