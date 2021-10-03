import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorButtonComponent } from '../calculator-button/calculator-button.component';
import { CalculatorButtonsComponent } from './calculator-buttons.component';

describe('CalculatorButtonsComponent', () => {
  let component: CalculatorButtonsComponent;
  let fixture: ComponentFixture<CalculatorButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorButtonComponent, CalculatorButtonsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
