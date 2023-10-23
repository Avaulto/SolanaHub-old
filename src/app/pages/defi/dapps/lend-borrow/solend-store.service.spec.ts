import { TestBed } from '@angular/core/testing';

import { SolendStoreService } from './solend-store.service';

describe('SolendStoreService', () => {
  let service: SolendStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolendStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
