import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-select-item',
  templateUrl: './select-item.component.html',
  styleUrls: ['./select-item.component.scss'],
})
export class SelectItemComponent implements OnChanges {
  @Input() item: any;
  @Input() searchTerm: string = '';
  @Input() isDropDownOpen: boolean = false;
  @Input() showDropDownIcon: boolean = false;
  @Output() onSelect = new EventEmitter();
  public dropDownIcon = faAngleDown;
  constructor() { }

  ngOnChanges(changes): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }
  public onSelectItem(item){
    if(!item?.selectable){
      return
    }else{
      this.onSelect.emit(item)
    }
  }
}
