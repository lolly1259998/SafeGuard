import { TestBed } from '@angular/core/testing';

import { ControlCenterService } from './control-center.service';

describe('ControlCenterService', () => {
  let service: ControlCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
