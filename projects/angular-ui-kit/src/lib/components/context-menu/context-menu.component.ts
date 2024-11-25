import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  standalone: true,
  imports:[CommonModule]
})
export class ContextMenuComponent {
  @Input() items: { text: string; icon?: string; position?: 'left' | 'right' | string }[] = [];
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() visible: boolean = false;

  @Output() itemSelected = new EventEmitter<string>();

  onItemClick(item: string): void {
    this.itemSelected.emit(item);
    this.visible = false;
  }
}
