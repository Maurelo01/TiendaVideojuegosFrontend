import { TestBed } from '@angular/core/testing';

import { VideojuegosService } from './videojuegos';

describe('Videojuegos', () => {
  let service: VideojuegosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideojuegosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
