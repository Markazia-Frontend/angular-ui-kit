import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { Router } from '@angular/router';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ICONS } from '../../constants/icon-paths';

interface TableColumn {
  name: string;
  filterType?: 'text' | 'dropdown' | 'date';
  displayName: string;
  options?: string[];
}

/**
 * ReusableTableComponent is a customizable table component that supports global and column-specific filtering. 
 * It allows users to filter data by text or dropdown selection, and supports row selection with the option 
 * to select all rows or specific rows. The component also provides visibility toggles for column filters and search inputs.
 * 
 * Key Features:
 * - Global text search filter to filter all columns.
 * - Column-specific filters for both text and dropdown values.
 * - Dropdown toggle for column visibility and search input.
 * - Select or deselect all rows with the option to filter selections.
 * - Emits the selected rows to the parent component.
 *
 * Inputs:
 * - `globalFilter`: A string for the global search filter.
 * - `tableData`: An array of data objects to populate the table.
 * - `tableColumns`: An array of column definitions, including column name, filter type, and optional dropdown options.
 * 
 * Outputs:
 * - `selectionChanged`: An event emitter that outputs an array of selected rows when selection changes.
 * 
 * Example Usage of the ReusableTableComponent:
 *
 * In your parent component's template:
 *
 * <app-reusable-table 
 *   [globalFilter]="globalSearchText" 
 *   [tableData]="data" 
 *   [tableColumns]="columns">
 * </app-reusable-table>
 *
 * In the parent component's class:
 * 
 * export class ParentComponent {
 *   globalSearchText: string = ''; // Global search input for filtering the table
 *   data: any[] = [
 *     { name: 'John', age: 30, country: 'USA' },
 *     { name: 'Alice', age: 25, country: 'UK' },
 *     { name: 'Bob', age: 35, country: 'Canada' }
 *   ]; // Data for the table
 *
 *   columns: TableColumn[] = [
 *     { name: 'name', filterType: 'text' },
 *     { name: 'age', filterType: 'text' },
 *     { name: 'country', filterType: 'dropdown', options: ['USA', 'UK', 'Canada'] }
 *   ]; // Table columns with filter types and dropdown options
 * }
 */
@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [DatepickerComponent, ButtonComponent, ModalComponent, CommonModule, FormsModule, LoadingSpinnerComponent],
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'],
})
export class ReusableTableComponent implements OnInit, OnChanges {
  itemIdForDeletetion?: number;
  isDeleteModalOpen: boolean = false;
  @Input() isConfirmDeleteModalOpen: boolean = false;;

  @Input() isLoading: boolean = false;
  @Input() rowCount: boolean = false;
  @Input() isRowClickable: boolean = false;
  @Input() withEditContextMenuButton: boolean = false;


  dateIcon = ICONS.date;
  dotsHorizantalIcon = ICONS.dotsHorizantalIcon;
  arrowDownIcon = ICONS.arrowDownIcon;
  searchIcon = ICONS.search;
  isDropdownOpen: { [key: string]: boolean } = {};
  filterVisibility: { [key: string]: boolean } = {};
  filterValues: { [key: string]: any } = {};
  filteredData: any[] = [];


  @Output() scroll = new EventEmitter<Event>();

  onScroll(event: Event): void {
    this.scroll.emit(event);
  }

  @Input() showInitialData: boolean = true;
  @Input() tableTitleHeading?: string = '';
  @Input() globalFilter: string = '';
  @Input() tableData: any[] = [];
  @Input() tableColumns: TableColumn[] = [];
  @Input() overflow_x: string = '';
  @Input() overflow_y: string = '';

  @Output() exportClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() deleteClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() editClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() confirmDeleteClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() rowCountChanged = new EventEmitter<number>();
  @Output() selectionChanged: EventEmitter<any[]> = new EventEmitter();
  @Input() numberOfCurrentRows?: number;

  ngOnInit(): void {
    this.initializeFilters();

    if (this.showInitialData) {
      // this.isLoading = true;
      this.filteredData = [...this.tableData];
    }

    this.numberOfCurrentRows = this.filteredData.length;
  }

  // Helper function to get the "id" field dynamically
  private getIdFromRow(row: any): any {
    if (!row) return null;
    const idKey = Object.keys(row).find(key => key.toLowerCase().includes('id'));
    return idKey ? row[idKey] : null;
  }

  onDateChange(date: any): void {
    date = this.formatToDateString(date.start);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.numberOfCurrentRows = this.tableData.length;
      this.filteredData = this.tableData;
      this.emitRowCount();
    }
    // if (changes['globalFilter']) {
    //   this.filterData();
    // }
  }

  private emitRowCount(): void {
    this.rowCountChanged.emit(this.filteredData.length);
  }

  private initializeFilters(): void {
    this.tableColumns.forEach((column) => {
      this.filterValues[column.name] = '';
      this.filterVisibility[column.name] = false;
    });
    this.filteredData = [];
  }

  onDeleteModalClose() {
    this.isConfirmDeleteModalOpen = false;
  }

  onDelete(): void {
    this.isConfirmDeleteModalOpen = false;
    this.confirmDeleteClicked.emit(true);
  }

  selectOption(option: string, columnName: string): void {
    this.filterValues[columnName] = option;
    this.filterData();
    this.isDropdownOpen[columnName] = false;
  }

  toggleColumnVisibility(columnName: string, isSearch: boolean = false): void {
    if (isSearch) {
      // Toggle the visibility of the clicked search input
      this.filterVisibility[columnName] = !this.filterVisibility[columnName];

      // Close all other search inputs
      Object.keys(this.filterVisibility).forEach((key) => {
        if (key !== columnName) {
          this.filterVisibility[key] = false;
        }
      });

      // Close all dropdowns
      Object.keys(this.isDropdownOpen).forEach((key) => {
        this.isDropdownOpen[key] = false;
      });
    } else {
      // Toggle the visibility of the clicked dropdown
      this.isDropdownOpen[columnName] = !this.isDropdownOpen[columnName];

      // Close all other dropdowns
      Object.keys(this.isDropdownOpen).forEach((key) => {
        if (key !== columnName) {
          this.isDropdownOpen[key] = false;
        }
      });

      // Close all search inputs
      Object.keys(this.filterVisibility).forEach((key) => {
        this.filterVisibility[key] = false;
      });
    }
  }

  toggleDropdown(columnName: string): void {
    this.toggleColumnVisibility(columnName, false);
  }

  toggleSearch(columnName: string): void {
    this.toggleColumnVisibility(columnName, true);
  }

  filterData(event: any = null): void {
    let date: string = event?.start ? this.formatToDateString(event.start) : '';

    if (this.globalFilter || this.showInitialData || date) {
      this.isLoading = true;
      setTimeout(() => {
        this.filteredData = this.tableData.filter((row) => {
          const matchesColumnFilters = this.tableColumns.every((column) => {
            let filterValue: any;

            filterValue = this.filterValues[column.name];

            const rowValue = row[column.name];

            const isMatch = !filterValue || this.matchValue(rowValue, filterValue, column.filterType || '');
            return isMatch;
          });

          return matchesColumnFilters;
        });

        this.isLoading = false;
      }, 2000);
    } else {
      this.isLoading = false;
    }

    setTimeout(() => {
      this.numberOfCurrentRows = this.filteredData.length;
    }, 2100);
  }


  private matchValue(rowValue: any, filterValue: any, filterType: string): boolean {
    if (rowValue === null || rowValue === undefined) return false;

    switch (filterType) {
      case 'dropdown':
        return rowValue.trim() === filterValue;
      case 'text':
        return this.isTextMatch(rowValue, filterValue);
      case 'date':
        return rowValue === filterValue;
      default:
        return false;
    }
  }

  dateChange(event: any, columnName: string) {
    let date = this.formatToDateString(event.start.toString())
    this.filterValues[columnName] = date;
    this.filterData();
  }

  activeMenuIndex: number | null = null;

  toggleMenu(index: number): void {
    this.activeMenuIndex = this.activeMenuIndex === index ? null : index;
  }


  deleteItem(index: number): void {
    this.isConfirmDeleteModalOpen = true;
    const id = this.getIdFromRow(this.filteredData[index]);
    if (id) {
      this.deleteClicked.emit(id);
    }
  }

  editItem(index: number) {
    const data = this.filteredData[index];
    if (data) {
      this.editClicked.emit(data);
    }
  }

  exportItem(i: number): void {
    // if (i < 0 || i >= this.filteredData.length) {
    //   return;
    // }

    // const record = this.filteredData[i];
    // if (!record) {
    //   return;
    // }

    // const formattedData = [record].map((row: any) => {
    //   const rowData: any = {};
    //   this.tableColumns.forEach((col) => {
    //     rowData[col.displayName || col.name] = row[col.name];
    //   });
    //   return rowData;
    // });

    // const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, `Record_${i + 1}`);

    // XLSX.writeFile(workbook, `Record_${i + 1}.xlsx`);
  }

  private isTextMatch(rowValue: any, filterValue: string): boolean {
    if (typeof rowValue === 'string') {
      return rowValue.toLowerCase().includes(filterValue.toLowerCase());
    } else if (typeof rowValue === 'number') {
      return rowValue.toString().includes(filterValue.toString());
    }
    return false;
  }

  toggleSelectAll(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement?.checked ?? false;
    this.filteredData.forEach((row) => (row.selected = isChecked));
  }

  isAllRowsSelected(): boolean {
    return this.filteredData.every((row) => row.selected);
  }

  onRowSelectionChange(): void {
    this.emitSelectedRows();
  }

  selectAllRows(): void {
    this.filteredData.forEach((row) => {
      row.selected = true;
    });
    this.emitSelectedRows();
  }

  private emitSelectedRows(): void {
    const selectedRows = this.filteredData.filter((row) => row.selected);
    this.selectionChanged.emit(selectedRows);
  }

  toggleSelectAllRows(): void {
    const newState = !this.isAllRowsSelected();
    this.filteredData.forEach((row) => {
      row.selected = newState;
    });
    this.emitSelectedRows();
  }

  constructor(private router: Router) { }
  @Output() rowDataClicked = new EventEmitter<Event>();

  onRowClick(rowData: any): void {
    if (rowData.accountID) {
      this.rowDataClicked.emit(rowData.accountID);
    }

    if (rowData.lookupTypeID) {
      const formattedLookupTypeName = rowData.lookupTypeName
        .replace(/\s+/g, '-')
        .toLowerCase();

      this.router.navigate(
        ['account/accounts/lookup-type/', formattedLookupTypeName],
        { state: { record: rowData } }
      );
    }
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  formatToDateString(date: Date | string): string {
    // Check if the input is already a valid Date object
    const d = (date instanceof Date && !isNaN(date.getTime())) ? date : new Date(date);
  
    // If the date is invalid, throw an error
    if (isNaN(d.getTime())) {
      throw new Error('Invalid date provided');
    }
  
    // Pad numbers for months and days to ensure they are in two digits
    const pad = (n: number) => (n < 10 ? '0' + n : n);
  
    const month = pad(d.getMonth() + 1);  // Get month (0-based, so add 1)
    const day = pad(d.getDate());         // Get day of the month
    const year = d.getFullYear();         // Get full year
  
    return `${month}/${day}/${year}`;     // Return in 'MM/DD/YYYY' format
  }
}
