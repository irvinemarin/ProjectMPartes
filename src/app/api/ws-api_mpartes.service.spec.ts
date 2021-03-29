import {TestBed} from '@angular/core/testing';

import {WSAuthService} from './ws-api_mpartes.service';

describe('WebServiceAPIService', () => {
  let service: WSAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WSAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
