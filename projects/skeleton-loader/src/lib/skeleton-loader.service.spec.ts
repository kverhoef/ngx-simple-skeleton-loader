import { TestBed } from '@angular/core/testing';

import { SkeletonLoaderService } from './skeleton-loader.service';

describe('SkeletonLoaderService', () => {
  let service: SkeletonLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkeletonLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
