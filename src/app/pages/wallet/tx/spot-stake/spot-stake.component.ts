import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-spot-stake',
  templateUrl: './spot-stake.component.html',
  styleUrls: ['./spot-stake.component.scss'],
})
export class SpotStakeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
  public stakeAccounts = [
    {
      validatorInfo: {
        name: 'avaulto1',
        fee: '5',
        uptime: '100',
        image: 'https://s3.amazonaws.com/keybase_processed_uploads/b543f95c3eca42f8c539b1a26624ff05_360_360.jpg'
      },
      staked: '100 SOL',
      accountAddr: 'CdoF....PjyP',
      balance: '105 SOL',
      reward: '5 SOL',
      status: 'activating'
    },
    {
      validatorInfo: {
        name: 'avaulto2',
        fee: '5',
        uptime: '100',
        image: 'https://s3.amazonaws.com/keybase_processed_uploads/b543f95c3eca42f8c539b1a26624ff05_360_360.jpg'
      },
      staked: '100 SOL',
      accountAddr: 'CdoF....PjyP',
      balance: '105 SOL',
      reward: '5 SOL',
      status: 'active'
    },
    {
      validatorInfo: {
        name: 'stakeconomy3',
        fee: '3',
        uptime: '98',
        image: 'https://s3.amazonaws.com/keybase_processed_uploads/bc8b40166acfdf577fe2ff14a6546f05_360_360.jpg'
      },
      staked: '84 SOL',
      accountAddr: 'saAF....RiaZ',
      balance: '88 SOL',
      reward: '4 SOL',
      status: 'deactivating'
    },
    {
      validatorInfo: {
        name: 'stakeconomy4',
        fee: '3',
        uptime: '98',
        image: 'https://s3.amazonaws.com/keybase_processed_uploads/bc8b40166acfdf577fe2ff14a6546f05_360_360.jpg'
      },
      staked: '84 SOL',
      accountAddr: 'saAF....RiaZ',
      balance: '88 SOL',
      reward: '4 SOL',
      status: 'inactive'
    },
  ]
}
