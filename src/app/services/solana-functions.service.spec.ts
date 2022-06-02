import { TestBed } from '@angular/core/testing';

import { SolanaFunctionsService } from './solana-functions.service';

describe('SolanaFunctionsService', () => {
  let service: SolanaFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolanaFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
