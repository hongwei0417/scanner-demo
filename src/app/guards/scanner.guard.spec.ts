import { TestBed } from '@angular/core/testing';

import { ScannerGuard } from './scanner.guard';

describe('ScannerGuard', () => {
  let guard: ScannerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ScannerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
