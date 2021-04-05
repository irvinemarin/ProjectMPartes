import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private ipCliente = '';
  private localUrl = 'http://localhost:9999/PjRestMesaPartes/apiresources-V01/';
  private token = `10805c84c51c7e2f159d001e33ee62f99aef9334818a1d36e8dff767a79dba3f`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json',
  ).set('Authorization', `${this.token}`);

  // .set('ip-client', this.ipCliente);

  constructor(private http: HttpClient) {
    this.getIP();
  }


  getIpCliente() {
    return this.http.get('http://api.ipify.org/?format=json');
  }

  getIP() {
    this.getIpCliente().subscribe((res: any) => {
      this.ipCliente = res.ip;
      // console.log(this.ipCliente);
    });
  }


  getDatosExpedienteEncontrado(xformato = 'nn', nExp = '0', nAnioExp = '0', xTipoMotivo = 'nn') {

    let headers = this.headers;

    return this.http.get(`${this.localUrl}escritos/getcreatedata/${xformato}_${nExp}_${nAnioExp}_${xTipoMotivo}`, {headers});
  }

  getDataInicial() {
    let headers = this.headers;
    return this.http.get(`${this.localUrl}escritos/getcreatedata/nn_0_0_nn`, {headers});
  }

  saveFiles(fileItem) {
    let fileItemPdf = JSON.stringify(fileItem);
    let paramsJson = {
      fileItemPdf: fileItemPdf
    };

    let headers = this.headers;
    return this.http.post<any>(`${this.localUrl}escritos/uploadFilePDF`, fileItemPdf, {headers});
  }

  validateUser(loginData) {
    let headers = this.headers;
    return this.http.get(`${this.localUrl}login/validate/${loginData.username}/${loginData.clave}`, {headers});
  }

  realoadData(username) {
    let headers = this.headers;
    return this.http.get(`${this.localUrl}login/geuserdata/${username}`, {headers});
  }


  registerUserAbogado(abogadoData) {
    let json = JSON.stringify(abogadoData);


    let headers = this.headers;
    return this.http.post<any>(`${this.localUrl}login/register`, json, {headers});

  }

  getDataRegister() {
    let headers = this.headers;
    return this.http.get(`${this.localUrl}login/data-register`, {headers});
  }

  getAllExpdientes(irvinmarin: string) {

    let headers = this.headers;
    let userid = localStorage.getItem('n_abogado');
    return this.http.get(`${this.localUrl}escritos/getAllDocumentos/${userid}`, {headers});

  }

  saveEscritoWeb(expedienteEncontrada, pdfList: any[], EscritosDataRequestJSON, parlistEncontrada: any[]) {

    let dataExpediente = (expedienteEncontrada);
    let dataEscritoRequest = (EscritosDataRequestJSON);
    let fileListPDF = (pdfList);
    let parteExpedienteList = (parlistEncontrada);

    let params = {
      'dataExpediente': dataExpediente,
      'dataEscritoRequest': dataEscritoRequest,
      'fileListPDF': fileListPDF,
      'parteExpedienteList': parteExpedienteList
    };

    let headers = this.headers;
    return this.http.post<any>(`${this.localUrl}escritos/create-document`, params, {headers});
  }

  getPathService(): string {
    return this.localUrl;
  }


  deleteFileFormDB(filePath: string) {
    let headers = this.headers;
    return this.http.get<any>(`${this.localUrl}escritos/dltFile/${filePath}`, {headers});
  }



  saveFilesExtraDB(pdfList, n_anioEscrito) {
    let fileListPDF = (pdfList);
    let params = {
      'n_anioEscrito': n_anioEscrito,
      'listPDF': fileListPDF,
    };

    let headers = this.headers;
    return this.http.post<any>(`${this.localUrl}escritos/addExtrafiles`, params, {headers});
  }

  sendDocument(itemExpediente) {
    let headers = this.headers;
    return this.http.get<any>(`${this.localUrl}escritos/sendDocument/
    ${itemExpediente.n_codigoEscrito}_${itemExpediente.n_unico}_${itemExpediente.n_anoEscrito}`, {headers});
  }

  saveNewPassword(clave, newclave, username) {
    let params = {clave, newclave, username};
    let headers = this.headers;
    return this.http.post<any>(`${this.localUrl}login/updatePassword`, params, {headers});

  }

  saveNewDataUser(userDataNew) {
    let headers = this.headers;
    return this.http.post<any>(`${this.localUrl}login/updateUserData`, userDataNew, {headers});
  }
}
