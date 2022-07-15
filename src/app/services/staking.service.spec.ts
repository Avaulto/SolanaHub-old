import { TestBed } from '@angular/core/testing';

import { StakingService } from './staking.service';

describe('StakingService', () => {
  let service: StakingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StakingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
