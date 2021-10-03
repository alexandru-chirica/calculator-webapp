import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { CalculationDisplayData } from '../../types/calculation-display-data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calculator-display',
  templateUrl: './calculator-display.component.html',
  styleUrls: ['./calculator-display.component.scss'],
})
export class CalculatorDisplayComponent implements OnInit {
  @Input()
  calculationDisplayData!: CalculationDisplayData | null;

  constructor() {}

  ngOnInit(): void {}
}
