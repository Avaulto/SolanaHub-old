import { TestBed } from '@angular/core/testing';

import { NftStoreService } from './nft-store.service';

describe('NftStoreService', () => {
  let service: NftStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NftStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
