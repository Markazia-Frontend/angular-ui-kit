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
  imports: [CommonModule,FormsModule],
  templateUrl: './phone-input.component.html',
  styleUrl: './phone-input.component.scss'
})
export class PhoneInputComponent {
  @Input() placeholder: string = 'Enter your phone number';
  @Output() phoneChange = new EventEmitter<string>();

  countries: Country[] = [
    { name: 'United States', code: '+1', flag: '🇺🇸' },
    { name: 'Canada', code: '+1', flag: '🇨🇦' },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'Jordan', code: '+962', flag: '🇯🇴' },
    { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦' },
  ];

  selectedCountry: Country = this.countries[0];
  phoneNumber: string = '';

  // Update the selected country
  onCountryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    console.log('Selected country:', selectedValue);
  }  

  // Emit phone number change
  onPhoneNumberChange(event: any) {
    this.phoneChange.emit(this.selectedCountry.code + this.phoneNumber);
  }
}
