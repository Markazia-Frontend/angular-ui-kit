import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
/**
 * Example Usage:
 *
 * <lib-modal
 *   [isOpen]="isModalOpen"
 *   [title]="'Example Modal'"
 *   [width]="'600px'"
 *   (close)="onModalClose()"
 * >
 *   <div modal-body>
 *     <p>This is the content of the modal.</p>
 *   </div>
 *   <div modal-footer>
 *      <lib-button type="secondary" size="medium" mode="default" label="Cancel" (click)="onModalClose()"></lib-button>
 *      <lib-button type="primary" size="medium" mode="default" label="Save" (click)="onConfirm()"></lib-button>
 *   </div>
 * </lib-modal>
 *
 * In your parent component:
 *
 * isModalOpen: boolean = false;
 *
 * openModal(): void {
 *   this.isModalOpen = true;
 * }
 *
 * onModalClose(): void {
 *   this.isModalOpen = false;
 * }
 *
 * onConfirm(): void {
 *   console.log('Confirmed!');
 *   this.onModalClose();
 * }
 */

@Component({
  selector: 'lib-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  /**
   * @Input isOpen: Controls whether the modal is open or closed.
   * Default: false
   */
  @Input() isOpen: boolean = false;

  /**
   * @Input title: The title displayed at the top of the modal.
   * Default: ''
   */
  @Input() title: string = '';

  /**
   * @Input width: Customizable width of the modal (e.g., '500px', '80%').
   * Default: '500px'
   */
  @Input() width: string = '500px';

  /**
 * @Input minHeight: Customizable minHeight of the modal (e.g., '500px', '80%').
 */
  @Input() minHeight?: string;

  /**
   * @Output close: Emits an event when the modal is closed.
   */
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    // Ensure modal starts closed by default
    if (!this.isOpen) {
      document.body.classList.remove('modal-open');
    }
  }

  /**
   * Handles closing the modal.
   */
  handleClose(): void {
    this.isOpen = false;
    this.close.emit();
    document.body.classList.remove('modal-open');
  }
}
