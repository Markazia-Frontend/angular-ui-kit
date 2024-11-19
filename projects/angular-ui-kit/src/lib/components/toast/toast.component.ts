import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'lib-toast',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';           
  @Input() toastType: 'success' | 'error' = 'success'; 
  @Input() duration: number = 3000;        
  @Output() closed = new EventEmitter<void>();

  isVisible: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.closeToast();
    }, this.duration);
  }

  closeToast() {
    this.isVisible = false;
    this.closed.emit();
  }
}
