import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input-group-control',
  templateUrl: './input-group-control.component.html',
  styleUrls: ['./input-group-control.component.scss'],
})
export class InputGroupControlComponent implements OnInit {
  // @Input() title: string;
  // @Input() balance: number;
  @Output() onSetMaxBalance = new EventEmitter();
  constructor() { }

  ngOnInit() {}

}
