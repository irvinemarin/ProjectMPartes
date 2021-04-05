import {Component, OnInit} from '@angular/core';
import {WebServiceAPIService} from '../../api/web-service-api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  typesOfShoes: string[] = ['Nosotros', 'Contacto'];
  breakpoint: any;
  dataContancto = {};

  constructor(
    private api: WebServiceAPIService
  ) {
  }


  ngOnInit() {
    // this.getDataFirebase();
  }

  private getDataFirebase() {

    this.api.getDataContacto().subscribe((res: any[]) => {
      res.forEach(item => {
        if (item.id == 'data_page') {
          this.dataContancto = item;
        }
      });
    }, (error) => {
    });
  }


}
