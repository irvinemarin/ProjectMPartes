import { TestBed } from '@angular/core/testing';

import { JavaApiService } from './java-api.service';

describe('JavaApiService', () => {
  let service: JavaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JavaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
