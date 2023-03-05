import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
} from "@angular/core";

import { IonSearchbar } from "@ionic/angular";
@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent{
  @ViewChild(IonSearchbar, { static: true }) searchInput: IonSearchbar;
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  @Input() placeholder: string;
  @Input() time: number = 0;
  @Input() value: string = ''

  constructor() {}
  onSearch(val) {
    this.search.emit(val);
  }

}
