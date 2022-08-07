import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.scss'],
})
export class SelectBoxComponent implements OnInit {
  @Input() dataset: Observable<any>;
  @Input() filterBy: string;
  @Output() onSelectItem = new EventEmitter();
  selectedItem: any;
  searchTerm = '';
  constructor() { }

  ngOnInit() {
    console.log(this.filterBy)

  }
  onSearch(term: any) {
    this.searchTerm = term.value;
  }
  setSelectedItem(item:any) {
    this.searchTerm = ''
    
    this.selectedItem = item;

    this.onSelectItem.emit(item);
  }
}
