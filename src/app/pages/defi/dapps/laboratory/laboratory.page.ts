import { Component, OnInit } from '@angular/core';
import { faAtom, faFlaskVial } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.page.html',
  styleUrls: ['./laboratory.page.scss'],
})
export class LaboratoryPage implements OnInit {
public labIcon = faFlaskVial;
  constructor() { }

  ngOnInit() {
  }

}
