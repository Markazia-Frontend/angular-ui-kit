import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports:[FormsModule,CommonModule],
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  selectedDate: Date | null = null;
  calendarVisible: boolean = false;
  dates: number[] = [];
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() {
    this.generateCalendar();
  }

  // Toggle the visibility of the calendar popup
  toggleCalendar(): void {
    this.calendarVisible = !this.calendarVisible;
    if (this.calendarVisible) {
      this.generateCalendar();
    }
  }

  // Generate the calendar days for the current month
  generateCalendar(): void {
    const today = new Date();
    const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const lastDate = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    this.dates = [];
    
    // Fill with empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      this.dates.push(0); // Empty space
    }

    // Fill the calendar with actual days
    for (let date = 1; date <= lastDate; date++) {
      this.dates.push(date);
    }
  }

  // Select a date from the calendar
  selectDate(date: number): void {
    if (date === 0) return; // Skip empty cells
    const today = new Date();
    this.selectedDate = new Date(today.getFullYear(), today.getMonth(), date);
    this.calendarVisible = false;
  }
}
