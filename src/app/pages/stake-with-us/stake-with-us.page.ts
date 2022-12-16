import { Component, OnDestroy, OnInit } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { ContactInfo, GetProgramAccountsConfig, GetProgramAccountsFilter, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { map, mergeMap, Observable, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import { Asset, ValidatorData } from 'src/app/models';
import { SolanaUtilsService, UtilsService } from 'src/app/services';
interface ValidatorRank {
  rank: number;
  numOfValidators: number;
}
@Component({
  selector: 'app-stake-with-us',
  templateUrl: './stake-with-us.page.html',
  styleUrls: ['./stake-with-us.page.scss'],
})
export class StakeWithUsPage implements OnInit, OnDestroy {
  public apy: number;
  private AvaultoVoteKey: string = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';
  private anchorWallet$: Subscription;
  public wallet: any;
  public getValidatorInfo: Observable<ValidatorData> = this._solanaUtilsService.getSingleValidatorData('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh').pipe(
   
    tap(async validator => validator.delegetors = await this._getDelegetors()),
    tap(async validator => validator.rank = await this._getRank()),
    map(validator => {
      this.apy = validator.apy_estimate;
      validator.stake = validator.stake.toLocaleString().split('.')[0];
      return validator
    }),
    shareReplay(1)
  )
  constructor(
    private _utilsService: UtilsService,
    private _walletStore: WalletStore,
    private _solanaUtilsService: SolanaUtilsService) { }

  async ngOnInit() {
    this.anchorWallet$ = this._walletStore.anchorWallet$.pipe(this._utilsService.isNotNull, this._utilsService.isNotUndefined).subscribe(
      (async wallet => {
        this.wallet = wallet;
        const balance = (await this._solanaUtilsService.connection.getBalance(wallet.publicKey)) / LAMPORTS_PER_SOL;
        this.wallet.balance = this._utilsService.shortenNum(balance)
        return this.wallet;
      }))
  }
  ngOnDestroy(): void {
    this.anchorWallet$.unsubscribe();
  }
  private async _getRank(){
    const { current } = await this._solanaUtilsService.connection.getVoteAccounts();
    // const nodes: ContactInfo[] = await this._solanaUtilsService.connection.getClusterNodes();
    const sortedValidators = current.sort((a, b) => b.activatedStake - a.activatedStake);
    const validatorRank = sortedValidators.findIndex((validator) => validator.votePubkey == this.AvaultoVoteKey);
    const rank = {
      rank: validatorRank,
      numOfValidators: sortedValidators.length
    }
    return rank;
  }
  private async _getDelegetors() {
    let delegetors = []
    try {
      const config: GetProgramAccountsConfig = {
        filters: [{
          // dataSize: 200,    //size of account (bytes)
          memcmp: {
            offset: 124,     //location of our query in the account (bytes)
            bytes: this.AvaultoVoteKey,  //our search criteria, a base58 encoded string
          }
        }]
      }
        ;
      delegetors = await this._solanaUtilsService.connection.getProgramAccounts(new PublicKey('Stake11111111111111111111111111111111111111'), config)
    } catch (error) {
      console.warn(error);
    }
    return delegetors
  }
}
