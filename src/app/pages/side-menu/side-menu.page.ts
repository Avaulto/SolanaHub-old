import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.page.html',
  styleUrls: ['./side-menu.page.scss'],
})
export class SideMenuPage implements OnInit {

  constructor() { }

  pages: any = [
    {
      title: "overview",
      url: "/side-menu/home",
      open: true,
      children: [
        {
          title: "wallet address",
          url: "/menu/profile",
        },
        {
          title: "wallet address",
          url: "/menu/profile",
        },
        {
          title: "wallet address",
          url: "/menu/profile",
        },
      ],
    },
    {
      title: "nft",
      url: "/side-menu/home",
    },

  ];

  ngOnInit() {
  }

}
