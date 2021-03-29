import { TestBed } from '@angular/core/testing';

import { WebServiceAPIService } from './web-service-api.service';

describe('WebServiceAPIService', () => {
  let service: WebServiceAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebServiceAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
