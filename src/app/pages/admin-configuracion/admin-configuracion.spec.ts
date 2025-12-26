import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfiguracion } from './admin-configuracion';

describe('AdminConfiguracion', () => {
  let component: AdminConfiguracion;
  let fixture: ComponentFixture<AdminConfiguracion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConfiguracion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConfiguracion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
