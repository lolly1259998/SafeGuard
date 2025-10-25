import { TestBed } from '@angular/core/testing';

import { ControlCenterAIService } from './control-center-ai.service';

describe('ControlCenterAIService', () => {
  let service: ControlCenterAIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlCenterAIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
