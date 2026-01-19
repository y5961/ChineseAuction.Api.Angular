import { TestBed } from '@angular/core/testing';

import { Producte } from './producte';

describe('Producte', () => {
  let service: Producte;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Producte);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
