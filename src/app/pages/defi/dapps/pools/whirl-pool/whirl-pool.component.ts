import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Whirlpool } from '../orca.model';
interface WhirlPoolView {
  
}
@Component({
  selector: 'app-whirl-pool',
  templateUrl: './whirl-pool.component.html',
  styleUrls: ['./whirl-pool.component.scss'],
})
export class WhirlPoolComponent implements OnInit {
  @Input() pool: Whirlpool;
  @Input() isConnected: boolean = false;
  @Output() poolLoaded = new EventEmitter()
  constructor() { }

  ngOnInit() {
    this.poolLoaded.emit(this.pool)
  }

}
