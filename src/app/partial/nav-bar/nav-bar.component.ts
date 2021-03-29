import {Component, OnInit} from '@angular/core';
import {WebServiceAPIService} from '../../api/web-service-api.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  txtBuscarValue: '';

  constructor(
    private api: WebServiceAPIService
  ) {
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {

    this.links.push(
      {titulo: 'INICIO', abrev: 'HO', active: true},
      {titulo: 'CONTACTO', abrev: 'CO', active: false},
      {titulo: 'QUIENES SOMOS', abrev: 'AB', active: false}
    );

    this.getDataAPP();

  }

  dataApp = {};

  private getDataAPP() {
    this.api.getDataAPP().subscribe((res: any[]) => {
      res.forEach(item => {
        if (item.id == 'data_app') {
          this.dataApp = item;
        }
      });
    }, (error) => {
    });
  }

  redirect(nameComponent: string, link: any): void {


    if (nameComponent == 'AB') {
      window.location.replace('/aboutAs');
    } else if (nameComponent == 'CO') {
      window.location.replace('/contact');
    } else {
      window.location.replace('');
    }
    this.links.forEach(element => {
      element.active = false;
      if (element == link) {
        link.active = true;
      }
    });


  }

  links = [];
  activeLink = this.links[0];


}
