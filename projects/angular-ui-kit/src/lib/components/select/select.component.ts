import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() options: string[] = [];  
  @Input() placeholder: string = '';
  @Output() selected = new EventEmitter<string>();  

  selectedOption: string = ''; 

  onSelect(option: string): void {
    this.selectedOption = option;
    this.selected.emit(option); 
  }
}
