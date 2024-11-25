import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  imports:[FormsModule,CommonModule]
})
export class CustomStepperComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium'; 
  @Input() value: number = 0; 
  @Input() step: number = 1;
  @Input() min: number = Number.MIN_SAFE_INTEGER;
  @Input() max: number = Number.MAX_SAFE_INTEGER;
  @Output() valueChange = new EventEmitter<number>();

  increment(): void {
    if (this.value + this.step <= this.max) {
      this.value += this.step;
      this.valueChange.emit(this.value);
    }
  }

  decrement(): void {
    if (this.value - this.step >= this.min) {
      this.value -= this.step;
      this.valueChange.emit(this.value);
    }
  }
}
