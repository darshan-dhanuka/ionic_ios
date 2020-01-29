import { TestBed } from '@angular/core/testing';

import { OttService } from './ott.service';

describe('OttService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OttService = TestBed.get(OttService);
    expect(service).toBeTruthy();
  });
});
