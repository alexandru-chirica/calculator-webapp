import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { CalculationType } from '../../entities/calculation-type.enum';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calculator-buttons',
  templateUrl: './calculator-buttons.component.html',
  styleUrls: ['./calculator-buttons.component.scss'],
})
export class CalculatorButtonsComponent {
  @Output()
  addPartEvent = new EventEmitter<string>();
  @Output()
  calculateEvent = new EventEmitter<CalculationType | undefined>();
  @Output()
  changeSignEvent = new EventEmitter<void>();
  @Output()
  clearEvent = new EventEmitter<void>();
  @Output()
  removeLastCharacterEvent = new EventEmitter<void>();
  calculationType = CalculationType;

  constructor() {}

  addPart(newPart: string): void {
    this.addPartEvent.emit(newPart);
  }

  calculate(calculationType?: CalculationType): void {
    this.calculateEvent.emit(calculationType);
  }

  changeSign(): void {
    this.changeSignEvent.emit();
  }

  clear() {
    this.clearEvent.emit();
  }

  removeLastCharacter(): void {
    this.removeLastCharacterEvent.emit();
  }
}
