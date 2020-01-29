import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mi-acc-event',
  templateUrl: './mi-acc-event.component.html',
  styleUrls: ['./mi-acc-event.component.scss'],
})
export class MiAccEventComponent implements OnInit {

  @Input()
  name: string;

  @Input()
  todate: string;
  
  @Input()
  fromdate: string;

  @Input()
  description: string;

  @Input()
  isMenuOpen: boolean = false;

  @Output()
  change: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router) { }

  openWatchPage() {
    this.router.navigate(['/home/tabs/watch']);
  }

  ngOnInit() {
  }

  public toggleAccordion(name): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.change.emit(name);
  }

  public broadcastName(name: string): void {
    this.change.emit(name);
  }

}
