import { TestBed } from '@angular/core/testing';

import { UserLevelService } from './user-level.service';

describe('UserLevelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLevelService = TestBed.get(UserLevelService);
    expect(service).toBeTruthy();
  });
});
