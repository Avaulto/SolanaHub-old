import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-box',
  templateUrl: './data-box.component.html',
  styleUrls: ['./data-box.component.scss'],
})
export class DataBoxComponent implements OnInit {
  @Input() title: string;
  @Input() desc: string;
  @Input() size: string;
  @Input() loading: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
