import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import type { Calculation } from '../types/calculation';
import { CalculationType } from '../entities/calculation-type.enum';
import { HttpClientService } from '../../shared/services/http-client.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class CalculationService {
  constructor(private readonly httpClientService: HttpClientService) {}

  getCalculationResult(calculation: Calculation): Observable<string> {
    return this.httpClientService.post<string>(
      `${environment.apiUrl}/calculations`,
      {
        ...calculation,
        calculationType: this.getCalculationTypeAsString(
          <CalculationType>calculation.calculationType
        ),
      }
    );
  }

  private getCalculationTypeAsString(calculationType: CalculationType) {
    const calculationTypeObject: { [key: string]: string } = CalculationType;
    const typeAsString = Object.keys(calculationTypeObject).find(
      (key) => calculationTypeObject[key] === calculationType
    );

    if (!typeAsString) {
      throw new Error(`Calculation type ${calculationType} was not found.`);
    }

    return typeAsString.toLowerCase();
  }
}
