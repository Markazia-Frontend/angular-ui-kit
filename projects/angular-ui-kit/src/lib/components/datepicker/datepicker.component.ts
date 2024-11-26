import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Custom Datepicker Component
 * 
 * This component provides a customizable date picker with options for single date selection
 * or range selection. It also includes month and year selectors, along with navigation for 
 * moving between months.
 * 
 * Usage:
 * 
 * 1. Single Date Picker:
 *    <lib-datepicker [placeholder]="'Select a date'" (dateSelected)="onDateSelected($event)"></lib-datepicker>
 *
 * 2. Date Range Picker:
 *    <lib-datepicker [placeholder]="'Select a range'" [range]="true" (dateSelected)="onDateRangeSelected($event)"></lib-datepicker>
 */
@Component({
  selector: 'lib-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DatepickerComponent {
  /** The placeholder text displayed in the input field */
  @Input() placeholder: string = 'Select date';

  /** Whether the date picker allows range selection */
  @Input() range: boolean = false;

  /** Event emitted when a date (or date range) is selected */
  @Output() dateSelected = new EventEmitter<{ start: Date; end?: Date }>();

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

  /**
   * Component initialization.
   * Sets the initial month and year to the current month/year.
   */
  ngOnInit() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();
    this.generateYearOptions();
    this.updateDaysInMonth();

    // Close calendar if clicked outside the datepicker
    document.addEventListener('click', (event) => {
      const clickedInside = (event.target as HTMLElement).closest('.datepicker-container');
      if (!clickedInside) {
        this.showCalendar = false;
      }
    });
  }

  /** Toggles the visibility of the calendar popup */
  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  /** Toggles the visibility of the year selector */
  toggleYearSelector() {
    this.showYearSelector = !this.showYearSelector;
    this.showMonthSelector = false;
  }

  /** Toggles the visibility of the month selector */
  toggleMonthSelector() {
    this.showMonthSelector = !this.showMonthSelector;
    this.showYearSelector = false;
  }

  /** Selects a year and updates the days of the month */
  selectYear(year: number) {
    this.currentYear = year;
    this.showYearSelector = false;
    this.updateDaysInMonth();
  }

  /** Selects a month and updates the days of the month */
  selectMonth(month: number) {
    this.currentMonth = month;
    this.showMonthSelector = false;
    this.updateDaysInMonth();
  }

  /** Navigates to the previous month */
  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.updateDaysInMonth();
  }

  /** Navigates to the next month */
  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.updateDaysInMonth();
  }

  /** Updates the list of days in the current month */
  updateDaysInMonth() {
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: days }, (_, i) => i + 1);
  }

  /** Checks if the given year is a leap year */
  isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /** Selects a date or range of dates */
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

    this.emitDate();
  }

  /** Checks if the given day is selected */
  isSelected(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return (
      this.selectedStartDate?.getTime() === date.getTime() ||
      this.selectedEndDate?.getTime() === date.getTime()
    );
  }

  /** Checks if the given day is within the selected date range */
  isInRange(day: number): boolean | undefined {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return (
      this.selectedStartDate &&
      this.selectedEndDate &&
      date > this.selectedStartDate &&
      date < this.selectedEndDate
    );
  }

  /** Emits the selected date range */
  emitDate() {
    this.dateSelected.emit({
      start: this.selectedStartDate!,
      end: this.selectedEndDate,
    });
  }

  /** Generates a list of years for selection */
  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }

  /** Formats the selected date as 'DD MMM YYYY' */
  get formattedDate(): string {
    if (this.selectedStartDate && this.selectedEndDate) {
      return `${this.formatDate(this.selectedStartDate)} - ${this.formatDate(this.selectedEndDate)}`;
    }
    if (this.selectedStartDate) {
      return this.formatDate(this.selectedStartDate);
    }
    return '';
  }

  /** Helper method to format a date as 'DD MMM YYYY' */
  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  /** Returns the full name of a month */
  getMonthName(month: number): string {
    return new Date(0, month).toLocaleString('default', { month: 'long' });
  }

  /** Returns a list of month names for the month selector */
  getMonthNames(): { name: string; index: number }[] {
    return Array.from({ length: 12 }, (_, i) => ({
      name: this.getMonthName(i),
      index: i,
    }));
  }

  /** Checks if the given day is the first selected date */
  isFirstSelected(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.selectedStartDate?.getTime() === date.getTime();
  }

  /** Checks if the given day is the last selected date */
  isLastSelected(day: number): boolean {
    const date = new Date(this.currentYear, this.currentMonth, day);
    return this.selectedEndDate?.getTime() === date.getTime();
  }
}
