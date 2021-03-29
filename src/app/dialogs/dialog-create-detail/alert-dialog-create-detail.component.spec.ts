import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertDialogCreateDetail } from './alert-dialog-create-detail.component';

describe('DialogContentExampleComponent', () => {
  let component: AlertDialogCreateDetail;
  let fixture: ComponentFixture<AlertDialogCreateDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertDialogCreateDetail ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogCreateDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
