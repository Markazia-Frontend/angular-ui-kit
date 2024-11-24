import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * ToastComponent displays toast notifications with various types (success, error, info, warning) and optional icons.
 * The component handles the automatic removal of toast notifications after a timeout and optionally includes a close button or action button.
 *
 * ### Example Usage:
 *
 * **In Parent Component HTML:**
 * ```html
 * <lib-toast #toastComponent [defaultIcon]="defaultSvgIcon" [withClose]="true" [WithAction]="true" [ActionLabel]="'Retry'"></lib-toast>
 *
 * <button (click)="showSuccess()">Show Success Toast</button>
 * <button (click)="showError()">Show Error Toast</button>
 * <button (click)="showInfo()">Show Info Toast</button>
 * <button (click)="showWarning()">Show Warning Toast</button>
 * ```
 * 
 * **In Parent Component TypeScript:**
 * ```typescript
 * import { Component, ViewChild } from '@angular/core';
 * import { ToastComponent } from './toast.component';
 *
 * @Component({
 *   selector: 'app-root',
 *   templateUrl: './app.component.html',
 *   styleUrls: ['./app.component.scss']
 * })
 * export class AppComponent {
 *   @ViewChild(ToastComponent) toastComponent!: ToastComponent;
 *
 *   defaultSvgIcon: string = `<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>`;
 *
 *   showSuccess(): void {
 *     this.toastComponent.addToast({
 *       message: 'Operation successful!',
 *       type: 'success',
 *       icon: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
 *         <path fill-rule="evenodd" clip-rule="evenodd" d="M13 23.4C18.7437 23.4 23.4 18.7438 23.4 13C23.4 7.25624 18.7437 2.60001 13 2.60001C7.25621 2.60001 2.59998 7.25624 2.59998 13C2.59998 18.7438 7.25621 23.4 13 23.4ZM11.3192 9.48077C10.8115 8.97309 9.98842 8.97309 9.48074 9.48077C8.97305 9.98845 8.97305 10.8116 9.48074 11.3192L11.1615 13L9.48074 14.6808C8.97305 15.1884 8.97305 16.0116 9.48074 16.5192C9.98842 17.0269 10.8115 17.0269 11.3192 16.5192L13 14.8385L14.6807 16.5192C15.1884 17.0269 16.0115 17.0269 16.5192 16.5192C17.0269 16.0116 17.0269 15.1884 16.5192 14.6808L14.8385 13L16.5192 11.3192C17.0269 10.8116 17.0269 9.98845 16.5192 9.48077C16.0115 8.97309 15.1884 8.97309 14.6807 9.48077L13 11.1615L11.3192 9.48077Z" fill="#FB7185"/>
 *       </svg>`
 *     });
 *   }
 *
 *   showError(): void {
 *     this.toastComponent.addToast({
 *       message: 'An error occurred!',
 *       type: 'error',
 *     });
 *   }
 *
 *   showInfo(): void {
 *     this.toastComponent.addToast({
 *       message: 'Here is some information!',
 *       type: 'info',
 *     });
 *   }
 *
 *   showWarning(): void {
 *     this.toastComponent.addToast({
 *       message: 'This is a warning!',
 *       type: 'warning',
 *     });
 *   }
 * }
 * ```
 * 
 * ### Component Methods:
 * - `addToast(toast: { message: string; type: 'success' | 'error' | 'info' | 'warning'; icon?: string })`
 *   - Adds a new toast notification with a specific message, type, and optional icon.
 * 
 * - `removeToast(toast: { message: string; type: string; icon?: SafeHtml })`
 *   - Removes the specified toast from the display.
 * 
 * ### Component Inputs:
 * - `withClose`: Boolean to determine if the toast includes a close button.
 * - `defaultIcon`: Default icon to use when no custom icon is provided.
 * - `WithAction`: Boolean to determine if the toast should include an action button.
 * - `ActionLabel`: The label text for the action button.
 */
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'lib-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @Input() WithSVG: boolean = false;          // Whether to include an SVG icon in the toast.
  @Input() WithAction: boolean = false;       // Whether to include an action button.
  @Input() ActionLabel: string = '';          // Label for the action button.
  @Input() withClose: boolean = false;        // Whether to display a close button on the toast.
  @Input() defaultIcon: string = '';          // Default SVG icon if no icon is provided.
  toasts: { title:string;subTitle?:string ; type: 'success' | 'error' | 'info' | 'warning'; icon?: SafeHtml }[] = [];

  constructor(
    private sanitizer: DomSanitizer,          // Used to sanitize icon HTML to prevent XSS vulnerabilities.
  ) {}

  /**
   * Add a new toast message.
   * @param toast The toast object containing a message, type, and optional icon.
   * @example
   * this.addToast({
   *   message: 'Operation successful!',
   *   type: 'success',
   *   icon: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>`
   * });
   */
  addToast(toast: { title:string;subTitle?:string ; type: 'success' | 'error' | 'info' | 'warning'; icon?: string }): void {
    const sanitizedIcon: SafeHtml = toast.icon
      ? this.sanitizer.bypassSecurityTrustHtml(toast.icon)
      : this.sanitizer.bypassSecurityTrustHtml(this.defaultIcon);

    this.toasts.push({
      ...toast,
      icon: sanitizedIcon,
    });

    // // Automatically remove the toast after a timeout
    // setTimeout(() => {
    //   this.removeToast(this.toasts[0]);  // Removes the first toast
    // }, 3000);  // Set toast duration to 3 seconds
  }

  /**
   * Remove a specific toast.
   * @param toast The toast object to be removed.
   * @example
   * this.removeToast(this.toasts[0]); // Removes the first toast
   */
  removeToast(toast: { title:string;subTitle?:string ; type: string; icon?: SafeHtml }): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
