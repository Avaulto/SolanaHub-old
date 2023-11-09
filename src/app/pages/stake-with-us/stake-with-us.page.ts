import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Connection, ContactInfo, GetProgramAccountsConfig, GetProgramAccountsFilter, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { firstValueFrom, forkJoin, map, mergeMap, Observable, shareReplay, Subject, Subscription, switchMap, tap } from 'rxjs';
import { Asset, ValidatorData, WalletExtended } from 'src/app/models';
import { ValidatorBribe } from 'src/app/models/validatorBribeData.model';
import { ApiService, SolanaUtilsService, UtilsService } from 'src/app/services';
import { LoyaltyService } from './loyalty/loyalty.service';



interface DirectStake {
  symbol: string,
  image: string,
  amount: number
}

@Component({
  selector: 'app-stake-with-us',
  templateUrl: './stake-with-us.page.html',
  styleUrls: ['./stake-with-us.page.scss'],
})
export class StakeWithUsPage implements OnInit, OnDestroy {
  public menu: string[] = ['native','liquid'];
  public currentTab: string = this.menu[0]
  public apy: number;
  private VoteKey: string = '7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh';

  public solPrice = this._solanaUtilsService.solPrice$;
  public stakeChange = this._solanaUtilsService.getStakeChange();
  public loyaltyLeagueStats = forkJoin({
    prizePool: this._loyaltyService.getPrizePool(),
    leaderBoard: this._loyaltyService.getLoyaltyLeaderBoard(),
    nextAirdrop: this._loyaltyService.getNextAirdrop()
  }).pipe(map((res) =>{
    const dStr = res.nextAirdrop.days > 1 ? 'days' : 'day';
    res.nextAirdrop.desc =  `ETA in ${res.nextAirdrop.days} ` + dStr
    return res
  }, shareReplay(1)))
  public getValidatorInfo: Observable<ValidatorData | any> = this._solanaUtilsService.getValidatorData('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh').pipe(
    switchMap(async (validator: ValidatorData) => {
      validator.delegetors = await this._getDelegetors()
      validator.rank = await this._getRank()
      this.apy = validator.apy_estimate;
      validator.activated_stake = Number(validator?.activated_stake) || 0;
      return validator
    }),
    shareReplay(1),
   
    
  )

  public getStakePoolDirectStake$: Observable<DirectStake[]> = this._solanaUtilsService.walletExtended$.pipe(
    this._utilsService.isNotNull,
    this._utilsService.isNotUndefined,
    switchMap(async res => {
      let directStakeArr = await firstValueFrom(this._getLiquidDirectStake()) || []
     
      // directStakeArr.push(...ds)
      return directStakeArr
    }),
    shareReplay(1),
    
    )


  constructor(
    private _loyaltyService:LoyaltyService,
    private _utilsService: UtilsService,
    private _solanaUtilsService: SolanaUtilsService,
    private _titleService: Title,
    private _apiService: ApiService
  ) {

  }
  async ionViewWillEnter() {
    this._titleService.setTitle('SolanaHub - stake with us')

  }


  async ngOnInit() {

  }
  ngOnDestroy(): void {
  }
  private async _getRank() {
    const { current } = await this._solanaUtilsService.connection.getVoteAccounts();
    // const nodes: ContactInfo[] = await this._solanaUtilsService.connection.getClusterNodes();
    const sortedValidators = current.sort((a, b) => b.activatedStake - a.activatedStake);
    const validatorRank = sortedValidators.findIndex((validator) => validator.votePubkey == this.VoteKey);
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
            bytes: this.VoteKey,  //our search criteria, a base58 encoded string
          }
        }]
      }
        ;
      delegetors = await this._solanaUtilsService.connection.getProgramAccounts(new PublicKey('Stake11111111111111111111111111111111111111'), config) as any
    } catch (error) {
      console.warn(error);
    }
    return delegetors
  }


  private _getLiquidDirectStake(): Observable<DirectStake[]> {
    const wallet: WalletExtended = this._solanaUtilsService.getCurrentWallet()
    return this._apiService.get(`${this._utilsService.serverlessAPI}/api/loyalty-points/get-validator-bribe`).pipe(map((r: ValidatorBribe) => {
      const record = r.validatorBribeData.find(vote => vote.walletOwner === wallet?.publicKey.toBase58())

      if (record) {
        const marinadeDS: DirectStake = { symbol: '◎', image: 'assets/images/icons/mSOL-logo.png', amount: Number(record.mSOL_directStake) }
        const solblazeDS: DirectStake = { symbol: '◎', image: 'assets/images/icons/bSOL-logo.png', amount: Number(record.bSOL_directStake) }
        return  [marinadeDS ,solblazeDS ]
      }
    }))

  }




}
