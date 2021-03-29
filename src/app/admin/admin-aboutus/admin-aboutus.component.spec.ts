import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAboutusComponent } from './admin-aboutus.component';

describe('AdminContactoComponent', () => {
  let component: AdminAboutusComponent;
  let fixture: ComponentFixture<AdminAboutusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAboutusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAboutusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
