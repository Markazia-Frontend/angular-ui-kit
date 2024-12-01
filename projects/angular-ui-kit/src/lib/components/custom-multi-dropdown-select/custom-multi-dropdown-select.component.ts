import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * CustomMultiDropdownSelectComponent is a multi-select dropdown component with search and tagging functionality.
 * It allows the user to select multiple items from a list of items, and can also support grouped and ungrouped items.
 */

/**
 * Usage Example:
 *
 * In the parent component's HTML:
 *
 * <lib-custom-multi-dropdown-select
 *   [items]="dropdownItems"
 *   [size]="'medium'"
 *   [displayTags]="true"
 *   (selectedItemsChange)="onSelectedItemsChange($event)">
 * </lib-custom-multi-dropdown-select>
 *
 * In the parent component's TypeScript:
 *
 * export class ParentComponent {
 *   dropdownItems = [
 *     { label: 'Item 1' },
 *     { label: 'Item 2' },
 *     { group: 'Group 1', items: [{ label: 'Item 3' }, { label: 'Item 4' }] },
 *     { label: 'Item 5' }
 *   ];
 *
 *   selectedItems: any[] = [];
 *
 *   onSelectedItemsChange(selectedItems: any[]) {
 *     this.selectedItems = selectedItems;
 *   }
 * }
 */

@Component({
  selector: 'lib-custom-multi-dropdown-select',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './custom-multi-dropdown-select.component.html',
  styleUrls: ['./custom-multi-dropdown-select.component.scss']
})
export class CustomMultiDropdownSelectComponent implements OnInit {
  // Inputs for the component
  @Input() items: any[] = []; // List of items to be displayed in the dropdown
  @Input() size: 'small' | 'medium' | 'large' = 'medium'; // Size of the dropdown
  @Input() displayTags: boolean = true; // Whether or not to display selected tags
  @Output() selectedItemsChange = new EventEmitter<any[]>(); // Output to notify the parent about selected items

  // Component state variables
  isOpen = false; // Boolean to track if the dropdown is open or closed
  searchQuery = ''; // Search query for filtering items
  filteredItems: any[] = []; // Filtered list of items based on the search query
  selectedItems: any[] = []; // List of selected items
  isAddDisabled: boolean = true; // Disable 'Add' button if the item already exists
  filteredGroupedItems: any[] = []; // Filtered grouped items (if any)
  filteredUngroupedItems: any[] = []; // Filtered ungrouped items
  private debounceTimeout: any; // Timeout for debouncing the search input
  isFocused : boolean = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // Initialize filtered items with the list of all items
    this.filteredItems = [...this.items];
  }

  /**
   * Toggles the dropdown visibility and filters the items based on the search query.
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.filterItems();
  }

  /**
   * Filters items based on the search query and updates the filtered items list.
   */
  filterItems(): void {
    this.filteredGroupedItems = [];
    this.filteredUngroupedItems = [];

    this.items.forEach(item => {
      if (item.group) {
        // Filter grouped items
        const groupItems = item.items.filter((child: { label: string }) =>
          child.label.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        if (groupItems.length > 0) {
          this.filteredGroupedItems.push({ group: item.group, items: groupItems });
        }
      } else if (item.label.toLowerCase().includes(this.searchQuery.toLowerCase())) {
        // Handle ungrouped items
        this.filteredUngroupedItems.push(item);
      }
    });

    this.updateAddButtonState();
  }

  /**
   * Updates the state of the 'Add' button, disabling it if the item already exists in the list.
   */
  updateAddButtonState(): void {
    const allItems = [
      ...this.items.flatMap(item =>
        item.group ? item.items : [item]
      ),
    ];

    this.isAddDisabled = allItems.some(
      (item) => item.label.toLowerCase() === this.searchQuery.toLowerCase()
    );
  }

  /**
   * Toggles the selection of an item in the dropdown.
   * If the item is selected, it will be removed from the selected items list.
   * If the item is not selected, it will be added to the selected items list.
   */
  toggleItemSelection(item: any, event: Event): void {
    this.isOpen = true; // Ensure the dropdown stays open after selection
    event.stopPropagation(); // Prevent event propagation to avoid closing the dropdown

    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter((i) => i.label !== item.label);
    } else {
      this.selectedItems.push(item);
    }

    // Emit the selected items list to the parent component
    this.selectedItemsChange.emit(this.selectedItems);
  }

  /**
   * Toggles the selection of an item when a tag is clicked (for display purposes).
   */
  toggleItemSelectionTag(item: any, event: Event): void {
    event.stopPropagation(); // Prevent event propagation

    if (this.isSelected(item)) {
      this.selectedItems = this.selectedItems.filter((i) => i.label !== item.label);
    } else {
      this.selectedItems.push(item);
    }

    // Emit the selected items list to the parent component
    this.selectedItemsChange.emit(this.selectedItems);
  }

  /**
   * Adds a new item to the list if it does not already exist and updates the selected items list.
   */
  addIfNotExists(): void {
    if (this.searchQuery.trim() === '' || this.isAddDisabled) return;

    const newItem = { label: this.searchQuery, icon: null };
    this.filteredUngroupedItems.push(newItem);
    this.items.push(newItem);
    this.selectedItems.push(newItem);
    this.searchQuery = '';
    this.filterItems();

    // Emit the updated selected items list
    this.selectedItemsChange.emit(this.selectedItems);
  }

  /**
   * Checks if an item is already selected.
   * @param item The item to check for selection
   */
  isSelected(item: any): boolean {
    return this.selectedItems.some((selected) => selected.label === item.label);
  }

  /**
   * Handles focus event to open the dropdown and filter items.
   */
  onFocus() {
    this.isFocused = true;
    this.isOpen = true;
    this.filterItems();
  }

  /**
   * Debounced search input function that triggers filtering after a delay.
   */
  onSearchInput() {
    // Clear the previous timeout if there is one
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Set a new timeout to trigger filtering after the specified delay
    this.debounceTimeout = setTimeout(() => {
      this.filterItems();
    }, 700);
  }

  onBlur() {
    this.isFocused = false;
  }

  /**
   * Function to sanitize the SVG content for safe usage in the template.
   * @param svg The raw SVG string
   */
  sanitizeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}