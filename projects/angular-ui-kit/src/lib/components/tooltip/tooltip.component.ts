import { Component, Input } from '@angular/core';

/**
 * TooltipComponent displays a tooltip with a given text, position, and optional action.
 * The tooltip can be positioned relative to its target element (`top`, `right`, `bottom`, `left`).
 * The width of the tooltip can also be customized through the `width` input.
 * 
 * Usage Example:
 * 
 * <lib-tooltip
 *   [position]="'top'"
 *   [text]="'This is a tooltip'"
 *   [action]="'Click me'"
 *   [width]="'200px'">
 * </lib-tooltip>
 * 
 * In the component that uses this tooltip, you can set the `text`, `position`, `action`, and `width`.
 */
@Component({
  selector: 'lib-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
})
export class TooltipComponent {
  /**
   * Defines the position of the tooltip relative to its target element.
   * Possible values are 'top', 'right', 'bottom', and 'left'.
   * 
   * @type {'top' | 'right' | 'bottom' | 'left'}
   * @default 'top'
   */
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top';

  /**
   * The text content to display inside the tooltip.
   * 
   * @type {string}
   * @default ''
   */
  @Input() text: string = '';

  /**
   * The action to associate with the tooltip, such as a button label.
   * 
   * @type {string}
   * @default ''
   */
  @Input() action: string = '';

  /**
   * The width of the tooltip.
   * Can be set as a string (e.g., '200px' or '50%').
   * 
   * @type {string}
   * @default 'auto'
   */
  @Input() width: string = 'auto';
}
