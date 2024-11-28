import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * `PopoverButtonComponent` is a reusable Angular component that renders a button with an optional SVG icon and text.
 * When clicked, the button toggles the visibility of its associated popover content.
 * This component allows for dynamic rendering of SVG icons and button text, and supports content injection into the popover through Angular's `ng-content` directive.
 *
 * Features:
 * - Accepts customizable button text through the `buttonText` input.
 * - Accepts customizable SVG content (icon) through the `iconSvg` input.
 * - Emits an event through the `toggle` output to notify the parent component when the button is clicked.
 * - Renders the SVG icon safely using Angular's `DomSanitizer` to prevent cross-site scripting (XSS) attacks.
 * - Displays popover content when the button is clicked and hides it when clicked again.
 *
 * Example Usage:
 * 
 * <lib-popover-button 
 *   [buttonText]="'Click me to toggle popover'" 
 *   [iconSvg]="chevronDownSvg"
 *   (toggle)="onTogglePopover()">
 *   <div>
 *     <h3>Popover Content</h3>
 *     <p>This content is dynamically shown when the button is clicked!</p>
 *   </div>
 * </lib-popover-button>
 *
 * In the example above, the component will render a button with the specified text and SVG icon.
 * When clicked, the popover content inside the `ng-content` directive will toggle its visibility.
 * The parent component can listen for the `toggle` event to take appropriate actions when the button is clicked.
 */

@Component({
  selector: 'lib-popover-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popover-button.component.html',
  styleUrls: ['./popover-button.component.scss']
})
export class PopoverButtonComponent {

  constructor(private sanitizer: DomSanitizer) {}

  /**
   * The button text.
   * @example 'Click me to toggle popover'
   */
  @Input() buttonText: string = 'Popover Button';

  /**
   * The SVG content that will appear on the left side of the button text.
   * @example '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"> ... </svg>'
   */
  @Input() iconSvg: string = '';
  
  /**
   * Output event that emits when the button is clicked (popover is toggled).
   */
  @Output() toggle = new EventEmitter<void>(); // Emit event when button is clicked

  /**
   * Tracks whether the popover is visible.
   */
  isPopoverVisible = false;

  /**
   * Safely sanitized SVG content to prevent XSS vulnerabilities.
   */
  safeIconSvg: SafeHtml = '';

  /**
   * Toggles the visibility of the popover.
   */
  togglePopover() {
    this.isPopoverVisible = !this.isPopoverVisible;
    this.toggle.emit(); // Emit toggle event
  }

  /**
   * Called when the input properties change.
   * Sanitizes the icon SVG string.
   */
  ngOnChanges() {
    // If iconSvg changes, sanitize the input string and assign it to safeIconSvg
    this.safeIconSvg = this.sanitizer.bypassSecurityTrustHtml(this.iconSvg);
  }
}
