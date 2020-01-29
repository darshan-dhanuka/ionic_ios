import { TestBed } from '@angular/core/testing';

import { OttSingleService } from './ott-single.service';

describe('OttSingleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OttSingleService = TestBed.get(OttSingleService);
    expect(service).toBeTruthy();
  });
});
