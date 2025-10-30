import { TestBed } from '@angular/core/testing';

import { FrontofficeAccessService } from './frontoffice-access.service';

describe('FrontofficeAccessService', () => {
  let service: FrontofficeAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontofficeAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
