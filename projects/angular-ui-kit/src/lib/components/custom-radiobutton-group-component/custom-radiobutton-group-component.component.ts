import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Custom Radio Button Group Component
 *
 * A reusable and customizable segmented radio button group component that supports:
 * - Icon rendering with safe SVG handling
 * - Configurable sizes (small, medium, large)
 * - Disabled state
 * - Two-way binding for selection changes
 *
 * @usageExample
 * ```
 * <lib-custom-radiobutton-group-component
 *   [RadioButtons]="[
 *     { label: 'Option 1', icon: '<svg>...</svg>' },
 *     { label: 'Option 2', icon: '<svg>...</svg>' },
 *     { label: 'Option 3', icon: '<svg>...</svg>' }
 *   ]"
 *   [selectedIndex]="1"
 *   [size]="'sm'"
 *   [disabled]="false"
 *   (selectionChange)="onSelectionChange($event)"
 * ></lib-custom-radiobutton-group-component>
 * ```
 */
@Component({
  selector: 'lib-custom-radiobutton-group-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-radiobutton-group-component.component.html',
  styleUrls: ['./custom-radiobutton-group-component.component.scss']
})
export class CustomRadiobuttonGroupComponentComponent {
  /**
   * @Input RadioButtons: Array of button objects containing a label and an SVG icon string.
   * Example:
   * [
   *   { label: 'Button1', icon: '<svg>...</svg>' },
   *   { label: 'Button2', icon: '<svg>...</svg>' },
   *   { label: 'Button3', icon: '<svg>...</svg>' }
   * ]
   */
  @Input() RadioButtons: { label: string; icon: string }[] = [];

  /**
   * @Input selectedIndex: The index of the initially selected segment.
   * Default: 0
   */
  @Input() selectedIndex: number = 0;

  /**
   * @Input disabled: Disable the entire radio button group if true.
   * Default: false
   */
  @Input() disabled: boolean = false;

  /**
   * @Input size: Controls the size of the radio buttons.
   * - 'sm': Small (padding: 8px 12px)
   * - 'md': Medium (padding: 10px 12px)
   * - 'lg': Large (padding: 16px 18px)
   * Default: 'md'
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * @Output selectionChange: Emits the index of the newly selected button when changed.
   */
  @Output() selectionChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitizes the provided SVG string to safely render as HTML.
   * @param icon - The raw SVG string
   * @returns A sanitized SafeHtml SVG string
   */
  getSanitizedIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  /**
   * Handles radio button selection and emits the selected index.
   * @param index - The index of the clicked button
   */
  onRadioChange(index: number): void {
    if (!this.disabled) {
      this.selectedIndex = index;
      this.selectionChange.emit(this.selectedIndex);
    }
  }

  /**
   * Dynamically generates the padding style based on the selected size.
   * @returns An object containing the padding style
   */
  getSegmentStyle(): { [key: string]: string } {
    const sizeMap: Record<string, string> = {
      sm: '8px 12px',
      md: '10px 12px',
      lg: '16px 18px'
    };

    return {
      padding: sizeMap[this.size] || sizeMap['md']
    };
  }
}
