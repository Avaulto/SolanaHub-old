import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnChanges {
  @Input() collection;
  hideSkelaton: boolean = false;
  constructor() { }

  ngOnChanges(){
    console.log(this.collection)
  }

}
