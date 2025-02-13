import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
/**
 * A reusable button component that supports multiple styles, sizes, and states.
 * This component allows you to create buttons with different types, sizes, icon placements,
 * and loading states, as well as handle button clicks with an event emitter.
 *
 * ### Example usage:
 * 
 * ```html
 * <lib-button
 *   type="primary"
 *   size="medium"
 *   mode="default"
 *   label="Submit"
 *   [disabled]="false"
 *   [isLoading]="false"
 *   icon="icon-check"
 *   iconPosition="left"
 *   (click)="onSubmit()"
 * ></lib-button>
 * ```
 *
 * ### Inputs:
 * - `size`: The size of the button. Options are `'small'`, `'medium'`, and `'big'`. Default is `'medium'`.
 * - `type`: The type of button. Options are `'primary'`, `'secondary'`, and `'tertiary'`. Default is `'primary'`.
 * - `mode`: The state of the button. Options are `'default'`, `'hover'`, `'loading'`, and `'disabled'`. Default is `'default'`.
 * - `iconPosition`: Defines the position of the icon relative to the label. Options are `'left'`, `'right'`, and `'none'`. Default is `'none'`.
 * - `icon`: The icon to display inside the button. It can be any valid icon string or null for no icon.
 * - `label`: The text to display inside the button.
 * - `isLoading`: A boolean to represent whether the button is in a loading state. Default is `false`.
 * - `disabled`: A boolean to disable the button. Default is `false`.
 * - `tooltip`: The text for the button's tooltip. Optional.
 *
 * ### Outputs:
 * - `click`: Emits an event when the button is clicked, provided the button is not disabled or loading.
 *
 * ### Methods:
 * - `handleClick()`: Emits the click event when the button is clicked. It only emits if the button is not disabled and not in the loading state.
 * 
 * ### Getters:
 * - `isIconOnly`: Returns a boolean indicating if the button has no label and only an icon.
 */
@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule,LoadingSpinnerComponent],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  @Input() size: 'small' | 'medium' | 'big' = 'medium';
  @Input() btnType: 'primary' | 'secondary' | 'tertiary' = 'primary';
  @Input() mode: 'default' | 'hover' | 'loading' | 'disabled' = 'default';
  @Input() iconPosition: 'left' | 'right' | 'none' = 'none';
  @Input() IsTextButton?: boolean = false;
  @Input() LoadingColor?: 'white' | 'gray' = 'gray';
  
  @Input() iconURL?='';


  @Input() label: string = '';
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() tooltip: string | null = null;
  @Output() click = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {
    console.log(this.iconURL);
    
  }

  /**
   * Emits the click event when the button is clicked, provided the button is not disabled or in loading state.
   */
  handleClick() {
    if (!this.disabled && !this.isLoading) {
      this.click.emit();
    }
  }

  /**
   * Determines if the button is icon-only, i.e., has no label but contains an icon.
   * @returns {boolean} True if the button has no label and has an icon.
   */
  get isIconOnly() {
    return !this.label && this.iconURL;
  }

  getButtonClasses(): Record<string, boolean> {
    return {
      disabled: this.disabled ?? false,
      TextButton: this.IsTextButton ?? false,
      'icon-only-button': !this.label,
      [this.btnType]: true,
      [this.size]: true,
      [this.mode]: true,
    };
  }
  
}