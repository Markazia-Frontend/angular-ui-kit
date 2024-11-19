import { TestBed } from '@angular/core/testing';

import { AngularUiKitService } from './angular-ui-kit.service';

describe('AngularUiKitService', () => {
  let service: AngularUiKitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularUiKitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
