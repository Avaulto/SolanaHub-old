import { Component, OnInit } from '@angular/core';
interface Connection {
  name: string;
  desc: string;
  icon: string;
  active:boolean;
}
@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.page.html',
  styleUrls: ['./new-wallet.page.scss'],
})
export class NewWalletPage implements OnInit {

  connectionsOptions:Connection[]= [
    {
      name:'public key',
      desc:'use public key to import avaliable data',
      icon:'',
      active: true
    },
    {
      name:'wallet adapter',
      desc:'use a 3rd party software to connect your wallet',
      icon:'',
      active: true
    },
    {
    name:'seed',
    desc:'connect using seed phaseprase',
    icon:'',
    active: false
  }
  ,{
    name:'private key',
    desc:'connect using private key',
    icon:'',
    active: false
  }
]
  constructor() { }

  ngOnInit() {
  }

}
