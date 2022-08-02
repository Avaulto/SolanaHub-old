import { Component, OnInit, ViewChild } from '@angular/core';
import { WalletConfig, WalletStore, Wallet } from '@heavy-duty/wallet-adapter';
import { Marinade, MarinadeConfig, Provider } from '@marinade.finance/marinade-ts-sdk'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import bn from 'bn.js'
import { TxInterceptService } from 'src/app/services/txIntercept.service';

@Component({
  selector: 'app-liquid-staking',
  templateUrl: './liquid-staking.component.html',
  styleUrls: ['./liquid-staking.component.scss'],
})
export class LiquidStakingComponent implements OnInit {
  public segmentUtilTab: string = 'stake'
  public wallet;
  public solBalance: number = 0;
  public mSOLBalance: number = 0;
  marinadeInfo;

  formSubmitted: boolean = false;
  stakeAmount: number;
  unStakeAmount: number;
  // @ViewChild('stakeAmount') stakeAmount: IonInput;
  // @ViewChild('unStakeAmount') unStakeAmount: IonInput;

  
  private marinade: Marinade;
  constructor(
    private solanaUtilsService: SolanaUtilsService,
    private txInterceptService: TxInterceptService,
    private _walletStore: WalletStore
  ) { }

  ngOnInit() {
    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if (wallet) {
        this.wallet = wallet;
        this.initMarinade();
        const splAccounts = await this.solanaUtilsService.getTokensAccountbyOwner(this.wallet.publicKey);
        this.solBalance = Number(((await this.solanaUtilsService.connection.getBalance(this.wallet.publicKey)) / LAMPORTS_PER_SOL).toFixed(3));
        console.log(this.solBalance)
        this.mSOLBalance = splAccounts.filter(account => account.account.data['parsed'].info.mint == "mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So")[0].account.data['parsed'].info.tokenAmount.amount / LAMPORTS_PER_SOL
        console.log(splAccounts,this.mSOLBalance)
      }
    })
  }

  setUtil(util: string){
    this.segmentUtilTab = util;
  }
  setMaxAmountSOL(){
    this.stakeAmount = this.solBalance;
    console.log(this.stakeAmount, this.solBalance)
  }
  setMaxAmountMSOL(){
    this.unStakeAmount = this.mSOLBalance;
  }
  async initMarinade() {
    const config = new MarinadeConfig({
      connection: this.solanaUtilsService.connection,
      publicKey: this.wallet.publicKey
    })
    this.marinade = new Marinade(config)
    const stake = await this.marinade.getMarinadeState();
    console.log(this.marinade , stake)
  }
  async liquidStake() {
    console.log('init stake')
    const amount:number = Number(this.stakeAmount);
    const sol = new bn(amount * LAMPORTS_PER_SOL);

    const {
      associatedMSolTokenAccountAddress,
      transaction,
    } = await this.marinade.deposit(sol);
    console.log(associatedMSolTokenAccountAddress.toBase58())
    this.txInterceptService.sendTx([transaction], this.wallet.publicKey)
    // console.log(signature)
  }
  public async liquidUnstake() {
    const sol = new bn(this.unStakeAmount * LAMPORTS_PER_SOL);
    const {
      associatedMSolTokenAccountAddress,
      transaction,
    } = await this.marinade.liquidUnstake(sol)
    console.log(associatedMSolTokenAccountAddress)
    // sign and send the `transaction`
    this.txInterceptService.sendTx([transaction], this.wallet.publicKey)
  }

}
