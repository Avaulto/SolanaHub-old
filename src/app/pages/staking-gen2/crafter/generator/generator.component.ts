import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WalletExtended } from 'src/app/models';
import { SolanaUtilsService } from 'src/app/services';
import { GuardianToMint } from '../../models/guardian-mint.interface';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss'],
})
export class GeneratorComponent implements OnInit {
  public mintOptions: GuardianToMint[] = [
    {
      tier: 'normal',
      minStake: 0,
      img: 'assets/images/nft-bg/1.png',
      perks: [
        {
          name: 'Proposal authority',
          icon: 'bulb-outline'
        }
      ]
    },
    {
      tier: 'rare',
      minStake: 100,
      img: 'assets/images/nft-bg/2.png',
      perks: [
        {
          name: '50% platform discount',
          icon: 'balloon-outline'
        },
        {
          name: 'Proposal authority',
          icon: 'bulb-outline'
        }
      ]
    },
    {
      tier: 'epic',
      minStake: 500,
      img: 'assets/images/nft-bg/3.png',
      perks: [
        {
          name: '50% platform discount',
          icon: 'balloon-outline'
        },
        {
          name: '1% cashback',
          icon: 'trending-up-outline'
        },
        {
          name: 'Proposal authority',
          icon: 'bulb-outline'
        }
      ]
    },
    {
      tier: 'legendary',
      minStake: 1000,
      img: 'assets/images/nft-bg/4.png',
      perks: [
        {
          name: '100% platform discount',
          icon: 'balloon-outline'
        },
        {
          name: '2% cashback',
          icon: 'trending-up-outline'
        },
        {
          name: 'Proposal authority',
          icon: 'bulb-outline'
        }
      ]
    }
  ]
  public guardianToMint: GuardianToMint = this.mintOptions[0]
  // add style overlay to illustrate which NFT option are available to mint
  public availableOption = []
  public wallet$: Observable<WalletExtended> = this._solanaUtilsService.walletExtended$
  constructor(private _solanaUtilsService: SolanaUtilsService) { }

  ngOnInit() { }
  canMint(solBalance: number) {

  }
}
