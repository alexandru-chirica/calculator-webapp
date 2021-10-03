import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  asapScheduler,
  BehaviorSubject,
  Observable,
  scheduled,
  Subject,
} from 'rxjs';
import {
  catchError,
  combineAll,
  filter,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { CalculationType } from '../../entities/calculation-type.enum';
import { CalculationService } from '../../services/calculation.service';
import type { Calculation } from '../../types/calculation';
import type { CalculationDisplayData } from '../../types/calculation-display-data';

const decimalSeparator = '.';
const emptyCalculationObject: Calculation = {
  calculationType: undefined,
  firstPart: '',
  secondPart: '',
};
const maxPartSize = 50;
const negativeSign = '-';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss'],
})
export class CalculatorComponent implements OnDestroy, OnInit {
  private readonly calculationSource = new BehaviorSubject<Calculation>({
    ...emptyCalculationObject,
  });
  private readonly currentPartSource = new BehaviorSubject<string>('');
  private readonly stopSource = new Subject<boolean>();
  calculation$ = this.calculationSource.asObservable();
  calculationDisplayData$!: Observable<CalculationDisplayData>;
  currentPart$ = this.currentPartSource.asObservable();
  getCalculation$!: Observable<string>;
  stop$ = this.stopSource.asObservable();

  constructor(private readonly calculationService: CalculationService) {}

  ngOnDestroy(): void {
    this.stopSource.next(true);
    this.stopSource.unsubscribe();
  }

  ngOnInit(): void {
    this.setCalculationSubscription();
    this.setCalculationDisplayDataObservable();
  }

  addToCurrentPart(newPart: string): void {
    let currentPart = this.currentPartSource.getValue();
    const alreadyHasDecimalSeparator = currentPart.includes(decimalSeparator);

    if (
      (alreadyHasDecimalSeparator || !currentPart) &&
      newPart === decimalSeparator
    ) {
      return;
    }

    if (currentPart.length >= maxPartSize) {
      return;
    }

    // If a 0 is not followed by a decimal separator, remove it.
    if (currentPart === '0' && newPart !== decimalSeparator) {
      currentPart = '';
    }

    this.currentPartSource.next(`${currentPart}${newPart}`);
  }

  /**
   * Contains most of the logic on how the calculator behaves when a button is pressed.
   * Should remove the decimal separator if it's the last one.
   */
  calculate(calculationType?: CalculationType): void {
    const calculation = this.calculationSource.getValue();
    let currentPart = this.currentPartSource.getValue();
    const {
      calculationType: oldCalculationType,
      firstPart,
      secondPart,
    } = calculation;

    // Remove the decimal separator if it's the last one.
    if (
      currentPart &&
      currentPart[currentPart.length - 1] === decimalSeparator
    ) {
      currentPart = currentPart.slice(0, -1);
    }

    // If there's no currentPart and no firstPart or calculationType then we return.
    // The user pressed '=' without the necessary data being present.
    if (!currentPart && (!firstPart || !calculationType)) {
      return;
    }

    // Clear the input if one of the operation buttons has been pressed when there's no firstPart yet
    // or it's been pressed after we've just finished a calculation ('=' was pressed before).
    if ((secondPart || !firstPart) && calculationType) {
      this.currentPartSource.next('');
    }

    // Don't do anything if the secondPart is present and the '=' was pressed.
    // It just means the user is pressing '=' continuously.
    if (secondPart && !calculationType) {
      return;
    }

    this.calculationSource.next({
      calculationType:
        secondPart || !currentPart || !firstPart
          ? calculationType
          : oldCalculationType,
      firstPart: secondPart || !firstPart ? currentPart : firstPart,
      nextCalculationType: firstPart ? calculationType : undefined,
      secondPart: secondPart || !firstPart ? '' : currentPart,
    });
  }

  changeSign(): void {
    const currentPart = this.currentPartSource.getValue();

    // Don't add a sign unless we have a number added.
    if (!currentPart) {
      return;
    }

    const currentPartWithNewSign =
      currentPart[0] === negativeSign
        ? currentPart.substring(1)
        : `${negativeSign}${currentPart}`;

    this.currentPartSource.next(currentPartWithNewSign);
  }

  clear(): void {
    this.currentPartSource.next('');
    this.calculationSource.next({ ...emptyCalculationObject });
  }

  removeLastCharacter(): void {
    const currentPart = this.currentPartSource.getValue();
    let currentPartWithoutLastCharacter = currentPart.slice(0, -1);

    // Remove the whole string if the number was negative.
    if (currentPartWithoutLastCharacter === negativeSign) {
      currentPartWithoutLastCharacter = '';
    }

    this.currentPartSource.next(currentPartWithoutLastCharacter);
  }

  /**
   * Handles the construction of the display data that gets fed into the CalculatorDisplayComponent.
   */
  private setCalculationDisplayDataObservable(): void {
    this.calculationDisplayData$ = scheduled(
      [this.calculation$, this.currentPart$],
      asapScheduler
    ).pipe(
      combineAll(),
      map(([calculation, currentPart]) => {
        const { calculationType, firstPart, secondPart } =
          typeof calculation === 'object'
            ? calculation
            : emptyCalculationObject;
        const displayDataParts = [
          firstPart,
          calculationType,
          secondPart,
          secondPart ? '=' : '',
        ].filter(Boolean);

        return {
          concatenatedParts: displayDataParts.join(' '),
          currentPart: typeof currentPart === 'string' ? currentPart : '',
        };
      })
    );
  }

  /**
   * Checks for the secondPart of the calculation and feeds the result into the currentPartSource.
   * It's done this way so we can continue with a new calculation, using the result.
   */
  private setCalculationSubscription() {
    this.calculation$
      .pipe(
        filter(
          (calculation) =>
            typeof calculation === 'object' && Boolean(calculation.secondPart)
        ),
        switchMap(({ calculationType, firstPart, secondPart }) =>
          this.calculationService.getCalculationResult({
            calculationType,
            firstPart,
            secondPart,
          })
        ),
        catchError((err) => scheduled(['0'], asapScheduler)),
        takeUntil(this.stop$)
      )
      .subscribe((calculationResult) => {
        const calculation = this.calculationSource.getValue();

        if (calculation.nextCalculationType) {
          this.calculationSource.next({
            calculationType: calculation.nextCalculationType,
            firstPart: calculationResult,
            nextCalculationType: undefined,
            secondPart: '',
          });
          this.currentPartSource.next('');
        } else {
          this.currentPartSource.next(String(calculationResult));
        }
      });
  }
}
