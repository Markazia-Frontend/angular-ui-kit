import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Country {
  name: string;
  code: string;
  flag: string;
}

@Component({
  selector: 'lib-phone-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './phone-input.component.html',
  styleUrls: ['./phone-input.component.scss']
})
export class PhoneInputComponent {
 
}
