import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogDelete } from './alert-dialog-delete.component';

describe('DialogContentExampleComponent', () => {
  let component: AlertDialogDelete;
  let fixture: ComponentFixture<AlertDialogDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDialogDelete ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
