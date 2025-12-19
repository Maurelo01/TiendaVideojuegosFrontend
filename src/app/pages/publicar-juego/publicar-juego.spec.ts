import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicarJuego } from './publicar-juego';

describe('PublicarJuego', () => {
  let component: PublicarJuego;
  let fixture: ComponentFixture<PublicarJuego>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicarJuego]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicarJuego);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
