import { TestBed } from '@angular/core/testing';

import { ImprtService } from './imprt.service';

describe('ImprtService', () => {
  let service: ImprtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImprtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
