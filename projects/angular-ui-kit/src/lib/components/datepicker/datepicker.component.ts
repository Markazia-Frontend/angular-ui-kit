import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DatepickerComponent {
  @Input() placeholder: string = 'Select date';
  @Input() range: boolean = false;
  @Output() dateSelected = new EventEmitter<{ start: Date; end?: Date }>();

  showCalendar = false;
  showYearSelector = false;
  showMonthSelector = false;

  currentMonth!: number;
  currentYear!: number;
  daysInMonth: number[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  years: number[] = [];

  selectedStartDate?: Date;
  selectedEndDate?: Date;

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
    this.showCalendar = !this.showCalendar;
  }

  toggleYearSelector() {
    this.showYearSelector = !this.showYearSelector;
    this.showMonthSelector = false;
  }

  toggleMonthSelector() {
    this.showMonthSelector = !this.showMonthSelector;
    this.showYearSelector = false;
  }

  selectYear(year: number) {
    this.currentYear = year;
    this.showYearSelector = false;
    this.updateDaysInMonth();
  }

  selectMonth(month: number) {
    this.currentMonth = month;
    this.showMonthSelector = false;
    this.updateDaysInMonth();
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      // If the current month is January, go to December of the previous year
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      // Otherwise, go to the previous month
      this.currentMonth--;
    }
    this.updateDaysInMonth();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      // If the current month is December, go to January of the next year
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      // Otherwise, go to the next month
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

    this.emitDate();
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
    this.dateSelected.emit({
      start: this.selectedStartDate!,
      end: this.selectedEndDate,
    });
  }

  generateYearOptions() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }

  get formattedDate(): string {
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
  
}
