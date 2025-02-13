import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { ICONS } from '../../constants/icon-paths';

/**
 * Custom Datepicker Component
 * 
 * This component provides a customizable date picker with options for single date selection
 * or date range selection. It also includes month and year selectors for easier navigation
 * between months, and supports an optional icon-only mode for the input field.
 * 
 * Usage:
 * 
 * 1. Single Date Picker:
 *    <lib-datepicker [placeholder]="'Select a date'" (dateChange)="onDateSelected($event)"></lib-datepicker>
 *    - Displays a simple date picker where only one date can be selected.
 *    - Emits the selected date in the `dateChange` event.
 *    
 * 2. Date Range Picker:
 *    <lib-datepicker [placeholder]="'Select a range'" [range]="true" (dateChange)="onDateRangeSelected($event)"></lib-datepicker>
 *    - Enables selection of a start and end date, displaying the selected range.
 *    - Emits an object containing both the start and end dates in the `dateChange` event.
 * 
 * 3. Icon-Only Mode:
 *    <lib-datepicker [withoutInput]="true" (dateChange)="onDateSelected($event)"></lib-datepicker>
 *    - Displays only an icon with no text input field.
 * 
 * Component Properties:
 * 
 * - `placeholder`: A string that defines the placeholder text in the input field.
 * - `range`: A boolean that enables/disables the date range selection feature.
 * - `withoutInput`: A boolean that hides the input field, displaying only an icon.
 * 
 * Events:
 * - `dateChange`: Emitted when a date or date range is selected. Provides the selected date(s).
 * 
 * Component Features:
 * - Allows selecting a single date or a range of dates.
 * - Displays month and year selectors for easier navigation.
 * - Emits the selected date(s) in ISO format when a date is selected.
 * - Automatically adjusts the calendar for leap years and different month lengths.
 * - Supports clicking outside the calendar to close the popup.
 * 
 * Public Methods:
 * - `toggleCalendar()`: Toggles the visibility of the calendar popup.
 * - `toggleYearSelector()`: Toggles the visibility of the year selector.
 * - `toggleMonthSelector()`: Toggles the visibility of the month selector.
 * - `selectYear(year: number)`: Selects a year from the year selector.
 * - `selectMonth(month: number)`: Selects a month from the month selector.
 * - `prevMonth()`: Navigates to the previous month.
 * - `nextMonth()`: Navigates to the next month.
 * - `selectDate(day: number)`: Selects a specific day from the calendar.
 * 
 * Internal Logic:
 * - `updateDaysInMonth()`: Updates the list of days based on the current month and year.
 * - `isSelected(day: number)`: Checks if a particular day is selected.
 * - `isInRange(day: number)`: Checks if a day is within the selected date range.
 * - `emitDate()`: Emits the selected date(s) via the `dateChange` event.
 * - `generateYearOptions()`: Generates a list of available years for selection.
 * 
 * Formatting:
 * - `formattedDate`: Returns the selected date(s) formatted as a string for display in the input field.
 * - `formatDate(date: Date)`: Formats a `Date` object as a string in "dd MMM yyyy" format.
 * - `getMonthName(month: number)`: Returns the full name of the month.
 * - `getMonthNames()`: Returns an array of all month names.
 * 
 * The component is designed to be used as a standalone component and includes necessary 
 * support for both single date and date range selection, along with user-friendly navigation options.
 */
@Component({
  selector: 'lib-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
  ],
})
export class DatepickerComponent {
  dateIcon: string = ICONS.date;
  @Input() customClasses: string = '';
  /** The placeholder text displayed in the input field */
  @Input() placeholder: string = 'Select date';

  /** Whether the date picker allows range selection */
  @Input() range: boolean = false;


  /** Whether the date picker with input or just an icon */
  @Input() withoutInput: boolean = false;

  /** Event emitted when a date (or date range) is selected */
  @Output() dateChange = new EventEmitter<{ start: Date; end?: Date }>();

  /** Whether the calendar popup is visible */
  showCalendar = false;

  /** Whether the year selector is visible */
  showYearSelector = false;

  /** Whether the month selector is visible */
  showMonthSelector = false;

  /** The current month (0-indexed, where 0 is January) */
  currentMonth!: number;

  /** The current year */
  currentYear!: number;

  /** List of days in the current month */
  daysInMonth: number[] = [];

  /** List of abbreviated weekday names (Sun, Mon, Tue, etc.) */
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /** List of available years for selection */
  years: number[] = [];

  /** The start date of the selected range */
  selectedStartDate?: Date;

  /** The end date of the selected range */
  selectedEndDate?: Date;

  constructor(private cdr: ChangeDetectorRef) { }

  updateView(): void {
    this.showYearSelector = false;
    this.showMonthSelector = false;
    this.cdr.detectChanges();
  }

  ngOnInit() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateYearOptions();
    this.updateDaysInMonth();

    document.addEventListener('click', (event) => {
      const clickedInside = (event.target as HTMLElement).closest('.datepicker-container');
      if (!clickedInside) {
        this.showCalendar = false;
      }
    });
  }

  toggleCalendar() {
    this.showYearSelector = false;
    this.showMonthSelector = false;
    this.showCalendar = !this.showCalendar;
  }

  toggleYearSelector() {
    this.showYearSelector = !this.showYearSelector;
    if (this.showYearSelector) {
      this.showMonthSelector = false;
    }
  }

  toggleMonthSelector() {
    this.showMonthSelector = !this.showMonthSelector;
    if (this.showMonthSelector) {
      this.showYearSelector = false;
    }
  }

  selectYear(year: number) {
    this.currentYear = year;
    this.updateDaysInMonth();
    this.showYearSelector = false;
    this.updateView();
  }

  selectMonth(month: number) {
    this.currentMonth = month;
    this.updateDaysInMonth();
    this.showMonthSelector = false;
    this.updateView();
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateDaysInMonth();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateDaysInMonth();
  }

  updateDaysInMonth() {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  selectDate(day: number) {
    const selectedDate = new Date(this.currentYear, this.currentMonth, day);

    if (!this.range || !this.selectedStartDate) {
      this.selectedStartDate = selectedDate;
      this.selectedEndDate = undefined;
    } else if (!this.selectedEndDate && selectedDate > this.selectedStartDate) {
      this.selectedEndDate = selectedDate;
    } else {
      this.selectedStartDate = selectedDate;
      this.selectedEndDate = undefined;
    }

    if (this.selectedEndDate) {
      this.value = JSON.stringify({
        startDate: this.selectedStartDate.toISOString(),
        endDate: this.selectedEndDate.toISOString(),
      });
    } else {
      this.value = this.selectedStartDate.toISOString();
    }

    this.onChange(this.value);
    this.emitDate();
    this.showCalendar = false;
  }

  isSelected(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return (
      this.selectedStartDate?.getTime() === date.getTime() ||
      this.selectedEndDate?.getTime() === date.getTime()
    );
  }

  isInRange(day: number): boolean | undefined {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return (
      this.selectedStartDate &&
      this.selectedEndDate &&
      date > this.selectedStartDate &&
      date < this.selectedEndDate
    );
  }

  emitDate() {
    if (this.selectedStartDate && this.selectedEndDate) {
      // Emit an object with start and end dates
      this.dateChange.emit({ start: this.selectedStartDate, end: this.selectedEndDate });
    } else if (this.selectedStartDate) {
      // Emit only the start date if there's no end date
      this.dateChange.emit({ start: this.selectedStartDate });
    } else {
      // Emit nothing or undefined if no date is selected
      this.dateChange.emit(undefined);
    }
  }

  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }

  get formattedDate(): string {
    if (this.value) {
      return this.formatDate(new Date(this.value));
    }

    if (this.selectedStartDate && this.selectedEndDate) {
      return `${this.formatDate(this.selectedStartDate)} - ${this.formatDate(this.selectedEndDate)}`;
    }
    if (this.selectedStartDate) {
      return this.formatDate(this.selectedStartDate);
    }
    return '';
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  getMonthName(month: number): string {
    return new Date(0, month).toLocaleString('default', { month: 'long' });
  }

  getMonthNames(): { name: string; index: number }[] {
    return Array.from({ length: 12 }, (_, i) => ({
      name: this.getMonthName(i),
      index: i,
    }));
  }

  isFirstSelected(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.selectedStartDate?.getTime() === date.getTime();
  }

  isLastSelected(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.selectedEndDate?.getTime() === date.getTime();
  }

  value: string = '';
  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }
}
