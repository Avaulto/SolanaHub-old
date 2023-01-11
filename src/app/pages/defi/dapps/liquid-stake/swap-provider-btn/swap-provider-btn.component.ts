import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { StakePoolProvider } from '../stake-pool.model';

@Component({
  selector: 'app-swap-provider-btn',
  templateUrl: './swap-provider-btn.component.html',
  styleUrls: ['./swap-provider-btn.component.scss'],
})
export class SwapProviderBtnComponent implements OnInit {
  @Input() selectedProvider: StakePoolProvider;
  @Input() providers: StakePoolProvider[];
  @Output() onProviderSelected: EventEmitter<StakePoolProvider> = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
