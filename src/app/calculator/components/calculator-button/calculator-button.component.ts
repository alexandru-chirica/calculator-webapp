import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-calculator-button',
  templateUrl: './calculator-button.component.html',
  styleUrls: ['./calculator-button.component.scss'],
})
export class CalculatorButtonComponent {
  @Input()
  label!: string;
  @Output()
  clickedEvent = new EventEmitter<string>();

  constructor() {}

  emitClickedEvent() {
    this.clickedEvent.emit(this.label);
  }
}
