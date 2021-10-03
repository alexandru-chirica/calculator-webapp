import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CalculationService } from './calculation.service';
import { HttpClientService } from '../../shared/services/http-client.service';

describe('CalculationService', () => {
  let service: CalculationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CalculationService, HttpClientService],
    });
    service = TestBed.inject(CalculationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
