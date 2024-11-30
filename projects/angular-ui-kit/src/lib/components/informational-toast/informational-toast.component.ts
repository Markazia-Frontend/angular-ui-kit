import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * A component that displays an informational toast notification with a title, subtitle, and icon.
 * The toast will automatically dismiss after a set duration (3 seconds).
 * 
 * Usage Example:
 * 
 * <lib-informational-toast
 *   [defaultIcon]="'<svg>...</svg>'">
 * </lib-informational-toast>
 * 
 * In the component that uses this, you can call the `addToast` method like this:
 * 
 * this.toastComponent.addToast({
 *   title: 'New Notification',
 *   subTitle: 'You have a new message!',
 *   icon: '<svg>...</svg>'
 * });
 */
@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'lib-informational-toast',
  templateUrl: './informational-toast.component.html',
  styleUrls: ['./informational-toast.component.scss'],
})
export class informationalToastComponent {
  /**
   * The default icon used for the toast notifications.
   * If no icon is provided when adding a toast, this icon will be used.
   * 
   * @type {string}
   * @default ''
   */
  @Input() defaultIcon: string = '';

  /**
   * List of active toasts to display.
   * Each toast can have a title, subtitle, and an icon.
   * 
   * @type {Array<{ title?: string, subTitle?: string, icon?: SafeHtml }>}
   * @default []
   */
  toasts: { title?: string; subTitle?: string; icon?: SafeHtml }[] = [];

  /**
   * Flag to track if any toast notifications are currently visible.
   * If no toasts remain, this will be set to `false`.
   * 
   * @type {boolean}
   * @default false
   */
  isVisible: boolean = false;

  /**
   * Constructor for the informationalToastComponent.
   * 
   * @param {DomSanitizer} sanitizer - Service to sanitize HTML content.
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Adds a new toast notification to the list and displays it.
   * If no icon is provided, the `defaultIcon` will be used.
   * 
   * @param {Object} toast - The toast notification object.
   * @param {string} toast.title - The title of the toast (required).
   * @param {string} [toast.subTitle] - The optional subtitle for the toast.
   * @param {string} [toast.icon] - The optional HTML string for the icon. If not provided, the default icon is used.
   */
  addToast(toast: { title: string; subTitle?: string; icon?: string }): void {
    const sanitizedIcon: SafeHtml = toast.icon
      ? this.sanitizer.bypassSecurityTrustHtml(toast.icon)
      : this.sanitizer.bypassSecurityTrustHtml(this.defaultIcon);

    // Clear the current toasts before adding a new one
    this.toasts = [];

    // Push the new toast with sanitized icon
    this.toasts.push({
      ...toast,
      icon: sanitizedIcon,
    });

    // Show the toast
    this.isVisible = true;

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
      this.removeToast(this.toasts[0]); // Removes the first toast
    }, 3000); // Set toast duration to 3 seconds
  }

  /**
   * Removes the provided toast from the list of toasts and hides the toast notifications
   * if no toasts remain.
   * 
   * @param {Object} toast - The toast notification to remove.
   * @param {string} [toast.title] - The title of the toast.
   * @param {string} [toast.subTitle] - The optional subtitle of the toast.
   * @param {SafeHtml} [toast.icon] - The icon of the toast.
   */
  removeToast(toast: { title?: string; subTitle?: string; icon?: SafeHtml }): void {
    // Filter out the toast to remove it
    this.toasts = this.toasts.filter((t) => t !== toast);

    // If there are no toasts left, hide the toast container
    if (this.toasts.length === 0) {
      this.isVisible = false;
    }
  }
}
