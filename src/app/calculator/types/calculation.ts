import { CalculationType } from '../entities/calculation-type.enum';

export interface Calculation {
  calculationType?: CalculationType;
  firstPart: string;
  nextCalculationType?: CalculationType;
  secondPart: string;
}
