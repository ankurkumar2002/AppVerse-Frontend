import { TestBed } from '@angular/core/testing';

import { ProfileupdateService } from './profileupdate.service';

describe('ProfileupdateService', () => {
  let service: ProfileupdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileupdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
