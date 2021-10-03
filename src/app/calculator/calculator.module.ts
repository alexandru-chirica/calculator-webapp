import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculatorRoutingModule } from './calculator-routing.module';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { CalculatorButtonsComponent } from './components/calculator-buttons/calculator-buttons.component';
import { CalculatorDisplayComponent } from './components/calculator-display/calculator-display.component';
import { CalculatorButtonComponent } from './components/calculator-button/calculator-button.component';
import { CalculationService } from './services/calculation.service';

@NgModule({
  declarations: [
    CalculatorComponent,
    CalculatorButtonsComponent,
    CalculatorDisplayComponent,
    CalculatorButtonComponent,
  ],
  imports: [CommonModule, CalculatorRoutingModule],
  providers: [CalculationService],
})
export class CalculatorModule {}
