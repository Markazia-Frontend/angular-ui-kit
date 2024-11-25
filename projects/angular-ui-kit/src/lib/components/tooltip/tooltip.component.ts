import { Component, Input, HostListener } from '@angular/core';

@Component({
  selector: 'lib-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  standalone: true,
})
export class TooltipComponent {
  @Input() position: 'top' | 'right' | 'bottom' | 'left' = 'top'; 
  @Input() text: string = '';
  @Input() action: string = '';
}
