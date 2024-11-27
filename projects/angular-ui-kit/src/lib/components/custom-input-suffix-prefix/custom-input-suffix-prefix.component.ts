import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-custom-input-suffix-prefix',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './custom-input-suffix-prefix.component.html',
  styleUrls: ['./custom-input-suffix-prefix.component.scss'] // Corrected to styleUrls
})
export class CustomInputSuffixPrefixComponent {
  @Input() prefixIcon: string = ''; // Prefix SVG icon
  @Input() suffixIcon: string = ''; // Suffix SVG icon
  @Input() placeholder: string = ''; // Placeholder for the input field
  @Input() value: string = ''; // Bindable value for the input
  @Output() valueChange = new EventEmitter<string>(); // Emit the value change

  constructor(private sanitizer: DomSanitizer) {}

  // Method to sanitize SVG icons
  sanitizeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // Emit the current value to the parent component
  onValueChange(): void {
    this.valueChange.emit(this.value);
  }
}
