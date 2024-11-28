import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * SelectComponent
 * This component represents a custom dropdown with options for size, placeholder, icon, and validation.
 * It allows users to select an option from a list and emits the selected item.
 * 
 * @example
 * // Usage Example:
 * <lib-select
 *   [options]="options"
 *   [placeholder]="'Select an option'"
 *   [required]="true"
 *   (selectionChange)="onSelectionChange($event)">
 * </lib-select>
 * 
 * @inputs:
 * - options: List of items to display in the dropdown, each having an `id` and `label`.
 * - placeholder: The placeholder text to show when no item is selected.
 * - required: Whether the dropdown is required for form validation.
 * - iconSvg: Optional SVG icon to display in the dropdown header.
 * - size: The size of the dropdown (`'small' | 'medium' | 'large'`).
 * 
 * @outputs:
 * - selectionChange: Emits the selected item with `id` and `label` when an option is selected.
 * 
 * @styles:
 * - This component uses custom styling defined in `select.component.scss`.
 */
@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent {
  /**
   * List of items to be displayed in the dropdown.
   * Each item should have an `id` and a `label` property.
   */
  @Input() options: { id: number; label: string }[] = [];

  /**
   * The placeholder text displayed when no item is selected.
   * Default is 'Choose value'.
   */
  @Input() placeholder: string = 'Choose value';

  /**
   * Determines whether the dropdown is required for form validation.
   * Default is false.
   */
  @Input() required: boolean = false;

  /**
   * Flag indicating whether the user has clicked on the dropdown.
   * Used to show validation messages.
   */
  hasClicked = false;

  /**
   * Sanitized SVG icon to be displayed in the dropdown header.
   * Uses Angular's DomSanitizer to prevent XSS vulnerabilities.
   */
  sanitizedIconSvg: SafeHtml | null = null;

  /**
   * Internal private variable to store the raw SVG icon string.
   * 
   * @param svg The raw SVG string passed to the iconSvg input.
   */
  private _iconSvg: string = '';
  @Input()
  set iconSvg(svg: string) {
    this._iconSvg = svg;
    this.sanitizedIconSvg = this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  get iconSvg(): string {
    return this._iconSvg;
  }

  constructor(private sanitizer: DomSanitizer) { }

  /**
   * Size of the dropdown. Options: 'small', 'medium', 'large'.
   * Default is 'medium'.
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Event emitted when a selection is made.
   * Emits the selected item with `id` and `label` properties.
   */
  @Output() selectionChange = new EventEmitter<{ id: number; label: string }>();

  /**
   * Controls the visibility of the dropdown menu.
   * Toggles between true and false when the dropdown header is clicked.
   */
  isOpen = false;

  /**
   * Stores the currently selected item from the dropdown.
   * Initially set to null until an item is selected.
   */
  selectedItem: { id: number; label: string } | null = null;

  /**
   * Toggles the visibility of the dropdown menu.
   * This method is called when the dropdown header is clicked.
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.hasClicked = true;
  }

  /**
   * Handles the selection of an item from the dropdown.
   * Updates the selected item and emits the selection change event.
   * Closes the dropdown after selection.
   * 
   * @param item The item that is selected.
   */
  selectItem(item: { id: number; label: string }) {
    this.selectedItem = item;
    this.selectionChange.emit(item);
    this.isOpen = false; // Close dropdown after selection
  }

  /**
   * Checks if the dropdown is valid based on the `required` input.
   * If `required` is true, it checks whether a selection has been made.
   * 
   * @returns true if valid, false if invalid, or undefined if no validation is required.
   */
  isValid(): number | true | undefined {
    return !this.required || this.selectedItem?.id; // Valid if required is false or an item is selected
  }
}
