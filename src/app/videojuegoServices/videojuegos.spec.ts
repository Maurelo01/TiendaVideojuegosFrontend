import { TestBed } from '@angular/core/testing';

import { Videojuegos } from './videojuegos';

describe('Videojuegos', () => {
  let service: Videojuegos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Videojuegos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
