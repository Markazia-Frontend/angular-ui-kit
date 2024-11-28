import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'lib-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  @Input() headline!: string;
  @Input() subtext?: string;
  @Input() icon?: string;
  @Input() size?: 'default'|'big' = 'default' ;

  isOpen: boolean = false;
  sanitizedIcon?: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.icon) {
      this.sanitizedIcon = this.sanitizer.bypassSecurityTrustHtml(this.icon);
    }
  }

  toggleAccordion(): void {
    this.isOpen = !this.isOpen;
  }
}
