import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-custom-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule], 
})
export class CustomTextareaComponent {
  @Input() placeholder: string = 'Enter text...';
  @Input() limit: number | null = null;
  @Input() rows: number = 4;
  @Input() cols: number = 50;
  @Input() value: string = '';

  @Output() valueChange = new EventEmitter<string>();

  onInput(event: Event): void {
    const input = (event.target as HTMLTextAreaElement).value;
    if (this.limit === null || input.length <= this.limit) {
      this.value = input;
      this.valueChange.emit(this.value);
    }
  }
}
