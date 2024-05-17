import { TestBed } from '@angular/core/testing';

import { ClassifyServiceService } from './classify-service.service';

describe('ClassifyServiceService', () => {
  let service: ClassifyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassifyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
