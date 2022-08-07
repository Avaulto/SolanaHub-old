import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss'],
})
export class SelectItemComponent implements OnInit {
  @Input() item: any;
  @Input() searchTerm: string = '';
  @Input() isDropDownOpen: boolean = false;
  @Input() showDropDownIcon: boolean = false;
  @Output() onSelect = new EventEmitter();
  constructor() { }

  ngOnInit() {
    // console.log(this.item)
  }
  public onSelectItem(item){
    console.log(item?.selectable)
    if(!item?.selectable){
      return
    }else{
      this.onSelect.emit(item)
    }
  }
}
