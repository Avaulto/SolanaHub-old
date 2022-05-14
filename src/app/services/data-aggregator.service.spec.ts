import { TestBed } from '@angular/core/testing';

import { DataAggregatorService } from './data-aggregator.service';

describe('DataAggregatorService', () => {
  let service: DataAggregatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataAggregatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
