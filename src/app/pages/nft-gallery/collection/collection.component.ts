import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnChanges {
  @Input() collection;
  constructor(private navCtrl: NavController) { }

  ngOnChanges(){
    console.log(this.collection)
  }

}
