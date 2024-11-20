import { DomSanitizer } from '@angular/platform-browser';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Usage Example:
 *
 * <lib-segmented-control
 *   [segments]="[
 *     { label: 'Home', icon: '<svg>...</svg>' },
 *     { label: 'Profile', icon: '<svg>...</svg>' },
 *     { label: 'Settings', icon: '<svg>...</svg>' }
 *   ]"
 *   [selectedIndex]="1"
 *   [size]="'lg'"
 *   [disabled]="false"
 *   (selectionChange)="onSegmentSelectionChange($event)"
 * ></lib-segmented-control>
 *
 * In the parent component:
 * - Define the segments array with labels and SVG icons.
 * - Listen to the `selectionChange` output to handle selection updates.
 * - Use the `size` input to control the segment sizes (sm, md, lg).
 */
@Component({
  selector: 'lib-segmented-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './segmented-control.component.html',
  styleUrls: ['./segmented-control.component.scss']
})
export class SegmentedControlComponent {
  /**
   * @Input segments: Array of segment objects containing a label and an SVG icon string.
   * Example: 
   * [
   *   { label: 'Home', icon: '<svg>...</svg>' },
   *   { label: 'Profile', icon: '<svg>...</svg>' },
   *   { label: 'Settings', icon: '<svg>...</svg>' }
   * ]
   */
  @Input() segments: { label: string; icon: string }[] = [];

  /**
   * @Input selectedIndex: The index of the initially selected segment.
   * Default: 0
   */
  @Input() selectedIndex: number = 0;

  /**
   * @Input disabled: Disable the entire segmented control if true.
   * Default: false
   */
  @Input() disabled: boolean = false;

  /**
   * @Input size: Controls the size of the segments. Acceptable values are:
   * - 'sm': Small (padding: 6px 12px)
   * - 'md': Medium (padding: 10px 12px)
   * - 'lg': Large (padding: 16px 18px)
   * Default: 'md'
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * @Output selectionChange: Emits the index of the newly selected segment when changed.
   */
  @Output() selectionChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Sanitizes the provided SVG string to safely render as HTML.
   * @param icon - The raw SVG string
   * @returns A sanitized SVG string
   */
  getSanitizedIcon(icon: string) {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  /**
   * Handles segment selection and emits the selected index.
   * @param index - The index of the clicked segment
   */
  onSegmentChange(index: number): void {
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
      sm: '6px 12px',
      md: '10px 12px',
      lg: '16px 18px'
    };

    return {
      padding: sizeMap[this.size] || sizeMap['md']
    };
  }
}
