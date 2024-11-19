import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * A reusable password input component that includes password strength indicator, visibility toggle,
 * and calculates password strength based on length and complexity.
 * This component allows users to enter and toggle the visibility of their password, 
 * while also displaying the strength of the password in real-time.
 *
 * ### Example usage:
 * 
 * ```html
 * <lib-password
 *   label="Create a Password"
 *   placeholder="Enter your password"
 *   [isLoading]="false"
 *   (passwordChange)="onPasswordChange($event)"
 * ></lib-password>
 * ```
 *
 * ### Inputs:
 * - `label`: The label to display next to the password input field. Optional.
 * - `placeholder`: The placeholder text for the password input field. Default is `'Enter your password'`.
 * - `isLoading`: A boolean indicating if the component is in a loading state. Default is `false`.
 *
 * ### Outputs:
 * - `passwordChange`: Emits an event whenever the password input changes, passing the current password as an argument.
 *
 * ### Methods:
 * - `togglePasswordVisibility()`: Toggles the visibility of the password input between masked and visible.
 * - `onPasswordChange(event: any)`: Called whenever the password input changes. It updates the password strength and percentage.
 *
 * ### Getters:
 * - `passwordStrength`: Returns a string representing the strength of the password (`'weak'`, `'medium'`, `'good'`, `'great'`).
 * - `strengthPercentage`: Returns a number representing the password strength as a percentage (25, 50, 75, 100).
 *
 * ### Example password strength calculation:
 * - `'weak'`: Password length < 6 (Strength: 25%)
 * - `'medium'`: Password length between 6-7 (Strength: 50%)
 * - `'good'`: Password length between 8-11 (Strength: 75%)
 * - `'great'`: Password length ≥ 12 (Strength: 100%)
 */
@Component({
  selector: 'lib-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent {
  @Input() label?: string;
  @Input() placeholder: string = 'Enter your password';
  password: string = '';
  passwordVisible: boolean = false;
  passwordStrength: 'weak' | 'medium' | 'good' | 'great' = 'weak';
  strengthPercentage: number = 0;
  isTooltipVisible: boolean = false;

  toggleTooltip() {
    this.isTooltipVisible = !this.isTooltipVisible;  
  }

  /**
   * Toggle password visibility (show/hide).
   */
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  /**
   * Handle password change event, update the strength and percentage.
   * @param event - The input event.
   */
  onPasswordChange(event: any) {
    this.passwordStrength = this.calculateStrength(this.password);
    this.strengthPercentage = this.calculateStrengthPercentage(this.passwordStrength);
  }

  /**
   * Calculate the strength of the password based on its length and complexity.
   * @param password - The entered password.
   * @returns 'weak' | 'medium' | 'good' | 'great' - The strength of the password.
   */
  calculateStrength(password: string): 'weak' | 'medium' | 'good' | 'great' {
    if (password.length < 6) {
      return 'weak';
    } else if (password.length >= 6 && password.length < 8) {
      return 'medium';
    } else if (password.length >= 8 && password.length < 12) {
      return 'good';
    } else {
      return 'great';
    }
  }

  /**
   * Map password strength to a corresponding progress bar percentage.
   * @param strength - The strength of the password.
   * @returns A number representing the strength percentage.
   */
  calculateStrengthPercentage(strength: 'weak' | 'medium' | 'good' | 'great'): number {
    switch (strength) {
      case 'weak':
        return 25;
      case 'medium':
        return 50;
      case 'good':
        return 75;
      case 'great':
        return 100;
      default:
        return 0;
    }
  }
}
