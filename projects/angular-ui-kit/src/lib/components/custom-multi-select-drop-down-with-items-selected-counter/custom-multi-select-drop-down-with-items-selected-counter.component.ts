import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";


/**
 * Custom Multi-Select Dropdown Component with Selected Items Counter
 * 
 * This component provides a dropdown menu for selecting multiple items. It supports:
 * - Grouped and ungrouped items
 * - A selected items counter displayed in the input field
 * - Filtering items by a search query
 * - Dynamic updates to selected items
 * 
 * Example Use Case: 
 * - Displaying a multi-select dropdown for a form field where users can select multiple tags, categories, or options.
 */

/**
 * Example Usage:
 *
 * <lib-custom-multi-select-drop-down-with-items-selected-counter
 *   [items]="[
 *     { group: 'Fruits', items: [{ label: 'Apple' }, { label: 'Banana' }] },
 *     { group: 'Vegetables', items: [{ label: 'Carrot' }, { label: 'Broccoli' }] },
 *     { label: 'Other Item' }
 *   ]"
 *   [size]="'medium'"
 *   (selectedItemsChange)="onSelectedItemsChange($event)">
 * </lib-custom-multi-select-drop-down-with-items-selected-counter>
 *
 * // In the parent component:
 * onSelectedItemsChange(selectedItems: any[]): void {
 *   console.log('Selected Items:', selectedItems);
 * }
 */
@Component({
  selector: 'lib-custom-multi-select-drop-down-with-items-selected-counter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-multi-select-drop-down-with-items-selected-counter.component.html',
  styleUrls: ['./custom-multi-select-drop-down-with-items-selected-counter.component.scss']
})
export class CustomMultiSelectDropDownWithItemsSelectedCounterComponent {
  /**
   * The list of items to display in the dropdown. Can include grouped and ungrouped items.
   * Example of grouped items:
   * [
   *   { group: 'Fruits', items: [{ label: 'Apple' }, { label: 'Banana' }] },
   *   { group: 'Vegetables', items: [{ label: 'Carrot' }, { label: 'Broccoli' }] }
   * ]
   */
  @Input() items: any[] = [];

  /**
   * Specifies the size of the dropdown. Adjusts padding and font size.
   * Can be 'small', 'medium', or 'large'.
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Emits the list of selected items whenever an item is selected or deselected.
   */
  @Output() selectedItemsChange = new EventEmitter<any[]>();

  // State variable to track whether the dropdown is open or closed.
  isOpen = false;

  // Display text showing the count of selected items in the input field.
  countItems = '';

  // Lists for grouped and ungrouped items, filtered based on user input or initial values.
  filteredGroupedItems: any[] = [];
  filteredUngroupedItems: any[] = [];

  // List of currently selected items.
  selectedItems: any[] = [];

  // Tracks if the input field is focused (used for styling or behavior control).
  isFocused = false;

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Lifecycle hook to initialize grouped and ungrouped items on component load.
   */
  ngOnInit() {
    this.initializeItems();
  }

  /**
   * Separates the input items into grouped and ungrouped categories for rendering.
   */
  initializeItems(): void {
    this.filteredGroupedItems = this.items.filter(item => item.group);
    this.filteredUngroupedItems = this.items.filter(item => !item.group);
  }

  /**
   * Toggles the dropdown's open/close state. Reinitializes filtered items when opening.
   */
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.resetFilteredItems();
    }
  }

  /**
   * Resets the filtered lists to their original state based on all items.
   */
  resetFilteredItems(): void {
    this.filteredGroupedItems = this.items
      .filter(item => item.group)
      .map(group => ({ ...group, items: [...group.items] }));
  
    this.filteredUngroupedItems = this.items
      .filter(item => !item.group);
  }

  /**
   * Filters items based on the user input in the search field.
   * Updates the grouped and ungrouped item lists dynamically.
   */
  filterItems(): void {
    const query = this.countItems.toLowerCase();
  
    this.filteredGroupedItems = this.items
      .filter(item => item.group)
      .map(group => ({
        ...group,
        items: group.items.filter((child: { label: string }) => child.label.toLowerCase().includes(query))
      }))
      .filter(group => group.items.length > 0);
  
    this.filteredUngroupedItems = this.items
      .filter(item => !item.group && item.label.toLowerCase().includes(query));
  }

  /**
   * Toggles the selection state of an item.
   * Updates the selected items list, emits changes, and recalculates the selected item count.
   * 
   * @param item - The item to toggle selection for.
   * @param event - The click event, used to stop propagation.
   */
  toggleItemSelection(item: any, event: Event): void {
    event.stopPropagation();
    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter(i => i.label !== item.label);
    } else {
      this.selectedItems.push(item);
    }
    this.updateSelectedItemsCount();
    this.selectedItemsChange.emit(this.selectedItems);
  }

  /**
   * Updates the input field with the count of selected items in a user-friendly format.
   */
  updateSelectedItemsCount(): void {
    const selectedCount = this.selectedItems.length;
    this.countItems = selectedCount === 0 ? '' : `${selectedCount} item${selectedCount > 1 ? 's' : ''}`;
  }

  /**
   * Checks if the given item is currently selected.
   * 
   * @param item - The item to check.
   * @returns `true` if the item is selected; `false` otherwise.
   */
  isSelected(item: any): boolean {
    return this.selectedItems.some(selected => selected.label === item.label);
  }

  /**
   * Sanitizes an SVG string for safe usage in the template.
   * 
   * @param svg - The SVG string to sanitize.
   * @returns The sanitized SVG wrapped as `SafeHtml`.
   */
  sanitizeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
