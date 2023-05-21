import { Component, OnInit, ViewEncapsulation } from '@angular/core';
interface Perk{
  name:string;
  value: string;
  icon: string;
}
@Component({
  selector: 'app-perks-table',
  templateUrl: './perks-table.component.html',
  styleUrls: ['./perks-table.component.scss'],
  // encapsulation:ViewEncapsulation.None
})
export class PerksTableComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  public perks: Perk[] =[
    {
    name:'tier',
    value:'epic',
    icon:'speedometer-outline',
  },
  {
    name:'platform discount',
    value:'50% discount',
    icon:'balloon-outline',
  },
  {
    name:'validator fee cashbach',
    value:'1% cashback',
    icon:'trending-up-outline',
  },
  {
    name:'Proposal authority',
    value:'suggest new features',
    icon:'bulb-outline',
  },
]
}
