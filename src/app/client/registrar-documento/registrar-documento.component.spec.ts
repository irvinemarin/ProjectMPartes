import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarDocumentoComponent } from './registrar-documento.component';

describe('RegistrarDocumentoComponent', () => {
  let component: RegistrarDocumentoComponent;
  let fixture: ComponentFixture<RegistrarDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarDocumentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
