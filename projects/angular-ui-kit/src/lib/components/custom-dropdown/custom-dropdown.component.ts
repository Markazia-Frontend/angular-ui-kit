import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * CustomDropdownComponent is a reusable dropdown component with built-in search functionality.
 * It allows the user to select an item from a list of options, search through the items, 
 * and add a new item if it doesn't exist.
 * 
 * @example
 * <lib-custom-dropdown 
 *   [items]="dropdownItems" 
 *   [size]="'medium'"
 *   (selectionChange)="onSelectionChange($event)"
 *   (itemAdded)="onItemAdded($event)">
 * </lib-custom-dropdown>
 * 
 * @description
 * This component provides the following features:
 * - **Search functionality**: Users can type in the input field to filter through the dropdown items.
 * - **Item selection**: Clicking on an item will select it, update the input with the selected item's label, and emit the selected item.
 * - **Dropdown visibility toggle**: The dropdown menu can be opened and closed by clicking on the input field.
 * - **Input focus**: When the input field is focused, the dropdown is automatically shown, and the list is filtered based on the search query.
 * - **Dropdown size**: The component supports three size options: 'small', 'medium', and 'large'.
 */
@Component({
  selector: 'lib-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
  standalone: true,
  imports:[CommonModule, FormsModule]
})
export class CustomDropdownComponent {
  /**
   * List of items to be displayed in the dropdown.
   * Each item should have an `id` and a `label` property.
   */
  @Input() items: { id: number; label: string }[] = [];

  /**
   * Size of the dropdown. Options: 'small', 'medium', 'large'.
   */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * Event emitted when a selection is made.
   * Emits the selected item with `id` and `label` properties.
   */
  @Output() selectionChange = new EventEmitter<{ id: number; label: string }>();

  /**
   * Event emitted when a new item is added.
   * Emits the added item with `id` and `label` properties.
   */
  @Output() itemAdded = new EventEmitter<{ id: number; label: string }>();

  isOpen = false; // Dropdown visibility state
  selectedItem: { id: number; label: string } | null = null; // Selected item
  searchQuery = ''; // Current search query
  filteredItems: { id: number; label: string }[] = []; // Filtered items based on search query

  /**
   * Initializes the component and sets the filtered items to all available items.
   */
  ngOnInit() {
    this.filteredItems = this.items;
  }

  /**
   * Toggles the visibility of the dropdown menu.
   * Closes the dropdown if it is open and resets the search.
   */
  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) this.resetSearch();
  }

  /**
   * Filters the items based on the current search query.
   * If the search query is empty, all items are displayed.
   */
  filterItems() {
    if (this.searchQuery) {
      this.filteredItems = this.items.filter(item =>
        item.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredItems = this.items;
    }
  }

  /**
   * Selects an item from the filtered list.
   * Updates the selected item and emits the selection.
   * Closes the dropdown and resets the search.
   * @param item The selected item
   */
  selectItem(item: { id: number; label: string }) {
    this.selectedItem = item;
    this.selectionChange.emit(item);
    this.isOpen = false;
    this.resetSearch();
  }

  /**
   * Resets the search query and restores the filtered items list to the original list.
   */
  private resetSearch() {
    this.searchQuery = '';
    this.filteredItems = this.items;
  }

  /**
   * Keeps the dropdown open when the input field is focused.
   * Filters the items as the user types.
   */
  onFocus() {
    this.isOpen = true;
    this.filterItems();  // Filter items when input gains focus
  }

  /**
   * Closes the dropdown when the input field loses focus.
   * Adds a slight delay to allow the user to click on dropdown items.
   */
  onBlur() {
    setTimeout(() => {
      this.isOpen = false;
    }, 200);
  }
}
