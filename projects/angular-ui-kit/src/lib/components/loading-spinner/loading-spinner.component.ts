import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * `LoadingSpinnerComponent` is a reusable Angular component that displays a circular loading spinner
 * with a gradient background. This spinner can be used to indicate that content is loading or processing.
 *
 * Example usage:
 *
 * <app-loading-spinner></app-loading-spinner>
 *
 * The spinner will automatically be centered on the screen and show a gradient loading animation.
 */

@Component({
  selector: 'lib-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  @Input() isDarkBackground?:boolean = false;
}
