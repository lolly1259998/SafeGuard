import { TestBed } from '@angular/core/testing';

import { AccessServiceTsService } from './access.service.ts.service';

describe('AccessServiceTsService', () => {
  let service: AccessServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
