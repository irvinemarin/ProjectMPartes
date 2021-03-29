import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogCreate } from './alert-dialog-contacto.component';

describe('DialogContentExampleComponent', () => {
  let component: AlertDialogCreate;
  let fixture: ComponentFixture<AlertDialogCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDialogCreate ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
