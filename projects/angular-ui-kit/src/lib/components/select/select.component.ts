import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * A reusable select dropdown component that supports multiple selection modes, search functionality,
 * groups, icons, and custom placeholders. This component allows users to select single or multiple options
 * and provides the ability to search through the available options.
 *
 * ### Example usage:
 *
 * ```html
 * <lib-select
 *   [size]="'medium'"
 *   [isMultiSelect]="true"
 *   [isSearchable]="true"
 *   [withGroups]="true"
 *   [hasIcon]="true"
 *   [options]="dropdownOptions"
 *   [placeholder]="'Select an option'"
 *   (selectionChange)="onSelectionChange($event)"
 * ></lib-select>
 * ```
 *
 * ### Inputs:
 * - `size`: The size of the select component. Options are `'small'`, `'medium'`, and `'big'`. Default is `'medium'`.
 * - `isMultiSelect`: A boolean indicating if the select component allows multiple selections. Default is `false`.
 * - `isSearchable`: A boolean indicating if the select component includes a search input for filtering options. Default is `false`.
 * - `withGroups`: A boolean indicating if the options are grouped. Default is `false`.
 * - `hasIcon`: A boolean indicating if the options include an icon. Default is `false`.
 * - `options`: An array of options for the dropdown, where each option is an object containing `value`, `label`, and optionally `group` and `icon`.
 * - `placeholder`: The placeholder text for the select input when no option is selected. Default is `'Select...'`.
 * - `iconForPlaceholder`: The icon to display alongside the placeholder text, if any. Default is `''` (empty string).
 *
 * ### Outputs:
 * - `selectionChange`: Emits an array of selected option values whenever the selection changes.
 *
 * ### Methods:
 * - `handleSelectionChange(option: string)`: Handles a selection change. Adds or removes the selected option based on whether multi-selection is enabled.
 * - `handleSearch(event: Event)`: Handles changes in the search input field to filter options based on the query.
 * - `filterOptions()`: Filters the available options based on the search query.
 * - `removeOption(option: string)`: Removes a selected option in multi-select mode.
 */

interface DropdownOption {
  value: string;
  label: string;
  group?: string;
  icon?: string;
}

@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent {
  @Input() size: 'small' | 'medium' | 'big' = 'medium';
  @Input() isMultiSelect: boolean = false;
  @Input() isSearchable: boolean = false;
  @Input() withGroups: boolean = false;
  @Input() hasIcon: boolean = false;
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select...';
  @Input() iconForPlaceholder: string = '';

  @Output() selectionChange = new EventEmitter<string[]>();

  selectedOptions: string[] = [];
  searchQuery: string = '';

  /**
   * Handles a selection change. In multi-select mode, adds or removes the selected option.
   * In single-select mode, it replaces the currently selected option.
   * @param option - The selected option's value.
   */
  handleSelectionChange(option: string) {
    if (this.isMultiSelect) {
      const index = this.selectedOptions.indexOf(option);
      if (index === -1) {
        this.selectedOptions.push(option);
      } else {
        this.selectedOptions.splice(index, 1);
      }
      this.selectionChange.emit(this.selectedOptions);
    } else {
      this.selectedOptions = [option];
      this.selectionChange.emit(this.selectedOptions);
    }
  }

  /**
   * Handles the search input event, updating the search query.
   * @param event - The input event triggered by the search field.
   */
  handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value.toLowerCase();
  }

  /**
   * Filters the available options based on the search query.
   * @returns The filtered list of options.
   */
  filterOptions() {
    const query = this.searchQuery.toLowerCase();
    return this.options.filter(option => option.label.toLowerCase().includes(query));
  }

  /**
   * Removes a selected option in multi-select mode.
   * @param option - The option to remove from the selected list.
   */
  removeOption(option: string): void {
    const index = this.selectedOptions.indexOf(option);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    }
  }
}
