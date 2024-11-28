import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-custom-multi-line-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-multi-line-accordion.component.html',
  styleUrl: './custom-multi-line-accordion.component.scss'
})
export class CustomMultiLineAccordionComponent {
  @Input() headerLabel: string = ''; // Label for the header
  @Input() headerRightText: string = ''; // Right-aligned text for the header
  @Input() footerLabel: string = ''; // Label for the footer
  @Input() footerRightText: string = ''; // Right-aligned text for the footer
  @Input() items: { label: string; content: string; rightText?: string; icon?: string }[] = []; // Accordion items
  @Input() size?: 'default'|'big' = 'default' ;

  isOpen: boolean = false; // Tracks whether the accordion is open or closed

  constructor(private sanitizer: DomSanitizer) {}

  // Toggle the accordion state
  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }

  // Sanitize SVG strings
  sanitizeSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
