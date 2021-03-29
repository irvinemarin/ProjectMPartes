import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {WebServiceAPIService} from '../../api/web-service-api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: WebServiceAPIService
  ) {
  }

  dataAboutUs = [];
  item = {
    titulo: ' ¿QUIENES SOMOS?',
    details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and',
    urlDecode: './assets/poder-juicial.png'
  };


  mision = {};
  vision = {};
  descripcionPage = '';
  contactoData = {
    urlDecode: ''
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.api.getDataAboutUs().subscribe((res: any[]) => {
        res.forEach(item => {
          if (item.id == 'mision') {
            console.table(item);
            this.mision = item;
          }
          if (item.id == 'vision') {
            console.table(item);
            this.vision = item;
          }
          if (item.id == 'data_page') {
            console.table(item);
            this.descripcionPage = item.dsc;
          }
        });
      }, (error) => {
      });
    });

  }
}


