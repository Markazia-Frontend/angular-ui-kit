import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * A reusable input component that supports multiple sizes, validation states, and SVG icon placements.
 *
 * @usage
 * <lib-input
 *   size="medium"
 *   label="Email"
 *   placeholder="Enter your email"
 *   [disabled]="false"
 *   [isValid]="false"
 *   [errorMessage]="validationErrorMessage"
 *   [iconLeft]="leftIconSvg"
 *   [iconRight]="rightIconSvg"
 *   (inputChange)="onInputChange($event)"
 * ></lib-input>
 */
@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() size: 'small' | 'medium' | 'big' = 'medium';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() isValid: boolean = true;
  @Input() errorMessage: string = '';
  @Input() iconLeft: string | null = null;
  @Input() iconRight: string | null = null;
  @Output() inputChange = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Returns sanitized SVG for the left icon.
   */
  get sanitizedIconLeft(): SafeHtml | null {
    return this.iconLeft ? this.sanitizer.bypassSecurityTrustHtml(this.iconLeft) : null;
  }

  /**
   * Returns sanitized SVG for the right icon.
   */
  get sanitizedIconRight(): SafeHtml | null {
    return this.iconRight ? this.sanitizer.bypassSecurityTrustHtml(this.iconRight) : null;
  }

  /**
   * Emit value change.
   */
  handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.inputChange.emit(value);
  }

  /**
   * Check if the input is active (focused).
   */
  get isActive(): boolean {
    return this.size === 'big' || this.size === 'medium';
  }
}
