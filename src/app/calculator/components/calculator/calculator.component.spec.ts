import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';
import { CalculatorButtonComponent } from '../calculator-button/calculator-button.component';
import { CalculatorButtonsComponent } from '../calculator-buttons/calculator-buttons.component';
import { CalculatorDisplayComponent } from '../calculator-display/calculator-display.component';
import { CalculationService } from '../../services/calculation.service';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CalculatorButtonComponent,
        CalculatorButtonsComponent,
        CalculatorComponent,
        CalculatorDisplayComponent,
      ],
      imports: [HttpClientModule],
      providers: [CalculationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
