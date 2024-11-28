import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

/**
 * Custom progress bar component that displays a progress bar with configurable options.
 * 
 * Example Usage in Template:
 * 
 * ```html
 * <lib-progress-bar
 *   [progress]="currentProgress"
 *   [barColor]="'#76c7c0'"
 *   [backgroundColor]="'#dcdcdc'"
 *   [height]="'30px'"
 *   [label]="'Loading...'"
 * ></lib-progress-bar>
 * ```
 * 
 * The component above will display a progress bar with a custom color, background color,
 * height, and a label inside the bar that shows the progress percentage.
 */

@Component({
  selector: 'lib-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  
  /**
   * The current progress value (between 0 and 100).
   * 
   * @default 0
   * @example 50
   */
  @Input() progress: number = 0;

  /**
   * The color of the progress bar.
   * 
   * @default '#626262'
   * @example '#76c7c0' (a teal color)
   */
  @Input() barColor: string = '#626262';

  /**
   * The background color of the progress bar.
   * 
   * @default '#F5F5F5'
   * @example '#dcdcdc' (a light gray color)
   */
  @Input() backgroundColor: string = '#F5F5F5';

  /**
   * The height of the progress bar.
   * 
   * @default '4px'
   * @example '30px' (to make the bar taller)
   */
  @Input() height: string = '4px';

  /**
   * The label text to be displayed inside the progress bar.
   * 
   * @example 'Loading...'
   */
  @Input() label: string = '';

}
