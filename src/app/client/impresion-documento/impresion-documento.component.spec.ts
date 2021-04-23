import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpresionDocumentoComponent } from './impresion-documento.component';

describe('ImpresionDocumentoComponent', () => {
  let component: ImpresionDocumentoComponent;
  let fixture: ComponentFixture<ImpresionDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpresionDocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpresionDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
