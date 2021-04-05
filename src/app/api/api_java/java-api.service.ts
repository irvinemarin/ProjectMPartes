import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JavaApiService {
  private ipCliente = '';
  private localUrl = 'http://localhost:9999/PjRestMesaPartes/apiresources-V01/';
  private token = `10805c84c51c7e2f159d001e33ee62f99aef9334818a1d36e8dff767a79dba3f`;
  private headers = new HttpHeaders().set('Content-Type', 'application/json',
  ).set('Authorization', `${this.token}`);

  constructor(private http: HttpClient) {
  }


  getDataInicial() {
    let headers = this.headers;
    return this.http.get(`${this.localUrl}escritos/getcreatedata/nn_0_0_nn`, {headers});
  }

  getDatosExpedienteEncontrado(xformato = 'nn', nExp = '0', nAnioExp = '0', xTipoMotivo = 'nn') {

    let headers = this.headers;

    return this.http.get(`${this.localUrl}escritos/getcreatedata/${xformato}_${nExp}_${nAnioExp}_${xTipoMotivo}`, {headers});
  }
}
