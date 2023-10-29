

import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, shareReplay, Subject, throwError } from 'rxjs';
import { StakePoolProvider } from './stake-pool.model';
import { UtilsService, SolanaUtilsService, ToasterService, ApiService, TxInterceptService } from 'src/app/services';
import { LAMPORTS_PER_SOL, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { BN, Marinade, MarinadeConfig, getRefNativeStakeSOLTx } from '@marinade.finance/marinade-ts-sdk';
import * as StakePoolSDK from '@solana/spl-stake-pool';

import { depositSol, withdrawStake, stakePoolInfo } from '@solana/spl-stake-pool';
import va from '@vercel/analytics';
import { toastData, WalletExtended } from 'src/app/models';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StakePoolStoreService {
  private _provider$: Subject<StakePoolProvider> = new Subject();
  public provider$: Observable<StakePoolProvider> = this._provider$.asObservable().pipe(shareReplay(), this._utilService.isNotNull)
  public currentProvider
  public marinadeSDK: Marinade;
  public stakePoolSDK = StakePoolSDK;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _utilService: UtilsService,
    private _toasterService: ToasterService,
    private _apiService: ApiService,
    private _txInterceptService: TxInterceptService,
  ) {

  }
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
      segmentClass: "toastError",

    }
    this._toasterService.msg.next(toastData);
    return throwError((() => error))
  }

  // avaliable stake pool providers to select
  public providers: StakePoolProvider[] = [{
    poolName: 'Marinade',
    apy: null,
    exchangeRate: null,
    tokenSymbol: "mSOL",
    tokenMint: new PublicKey("mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So"),
    tokenImageURL: 'assets/images/icons/mSOL-logo.png',
    poolPublicKey: new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi"),
    MEVDelegation: false,
    website: "https://stake.solblaze.org/"
  },
  {
    poolName: "JPOOL",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "jSOL",
    tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
    tokenImageURL: "https://raw.githubusercontent.com/mfactory-lab/jpool-pub/main/assets/images/jsol.png",
    poolPublicKey: new PublicKey("CtMyWsrUtAwXWiGr9WjHT5fC3p3fgV8cyGpLTo2LJzG1"),
    MEVDelegation: false,
    website: "https://jpool.one/"
  },
  {
    poolName: "Jito",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "JitoSOL",
    tokenMint: new PublicKey("J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn"),
    tokenImageURL: "https://storage.googleapis.com/token-metadata/JitoSOL-256.png",
    poolPublicKey: new PublicKey("Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb"),
    MEVDelegation: true,
    website: "https://www.jito.network/"
  },
  {
    poolName: "Socean",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "scnSOL",
    tokenMint: new PublicKey("7Q2afV64in6N6SeZsAAB81TJzwDoD6zpqmHkzi9Dcavn"),
    tokenImageURL: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/5oVNBeEEQvYi1cX3ir8Dx5n1P7pdxydbGF2X4TxVusJm/logo.png",
    poolPublicKey: new PublicKey("5oc4nmbNTda9fx8Tw57ShLD132aqDK65vuHH4RU1K4LZ"),
    MEVDelegation: false,
    website: "https://socean.fi/"
  },
  {
    poolName: "SolBlaze",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "bSOL",
    tokenMint: new PublicKey("bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1"),
    tokenImageURL: 'assets/images/icons/bSOL-logo.png',
    poolPublicKey: new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi"),
    MEVDelegation: true,
    website: "https://stake.solblaze.org/"
  },
  {
    poolName: "Cogent",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "cgntSOL",
    tokenMint: new PublicKey("CgnTSoL3DgY9SFHxcLj6CgCgKKoTBr6tp4CPAEWy25DE"),
    tokenImageURL: "assets/images/icons/cgntSOL.png",
    poolPublicKey: new PublicKey("CgntPoLka5pD5fesJYhGmUCF8KU1QS1ZmZiuAuMZr2az"),
    MEVDelegation: true,
    website: "https://cogentcrypto.io/app"
  },
  {
    poolName: "Laine",
    apy: null,
    exchangeRate: null,
    tokenSymbol: "laineSOL",
    tokenMint: new PublicKey("LAinEtNLgpmCP9Rvsf5Hn8W6EhNiKLZQti1xfWMLy6X"),
    tokenImageURL: "assets/images/icons/laineSOL.webp",
    poolPublicKey: new PublicKey("2qyEeSAWKfU18AFthrF7JA8z8ZCi1yt76Tqs917vwQTV"),
    MEVDelegation: true,
    website: "https://stake.laine.one/"
  },
  ]
  // public getCurrentPorvider(): StakePoolProvider{
  //   return this._provider$.value;
  // }
  public updateSolBlazePool(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await (await fetch(
          "https://stake.solblaze.org/api/v1/update_pool?network=mainnet-beta"
        )).json();
        if (result.success) {
          resolve();
        } else {
          reject();
        }
      } catch (err) {
        reject();
      }
    });
  }
  public async selectProvider(provider: StakePoolProvider) {
    this._provider$.next(provider)
  }

  async initMarinade(wallet: WalletExtended): Promise<void> {
    const config = new MarinadeConfig({
      connection: this._solanaUtilsService.connection,
      publicKey: wallet.publicKey,
      referralCode: new PublicKey('9CLFBo1nsG24DNoVZvsSNEYRNGU1LAHGS5M3o9Ei33o6'),
    })
    this.marinadeSDK = new Marinade(config)
  }
  public async getStakePoolsInfo(): Promise<void> {
    try {
      this.providers = (await firstValueFrom(this._apiService.get('https://cogentcrypto.io/api/stakepoolinfo'))).stake_pool_data.map((provider: StakePoolProvider) => {
        provider.poolName == 'BlazeStake' ? provider.poolName = 'SolBlaze' : provider.poolName
        provider.poolPublicKey = new PublicKey(provider.poolPublicKey)
        provider.tokenMint = new PublicKey(provider.tokenMint)
        return provider
      })
        .filter(provider => provider.poolName != "DAO Pool")
        .sort((a, b) => a.tokenMintSupply > b.tokenMintSupply ? -1 : 1)
    } catch (error) {
      console.error(error)
    }
  }

  public async stakeSOL(pool: string, sol: BN, validatorVoteAccount?: string) {
    const walletOwner = this._solanaUtilsService.getCurrentWallet()
    let track = null;
    if (pool === 'marinade') {
      if (!this.marinadeSDK) {
        await this.initMarinade(walletOwner)
      }
      track = await this._marinadeStakeSOL(sol, walletOwner, validatorVoteAccount)
    } else {
      const selectedPool: StakePoolProvider = this.providers.find(p => p.poolName.toLowerCase() === pool);
      track = await this._stakePoolStakeSOL(selectedPool.poolPublicKey, walletOwner, sol, validatorVoteAccount)
    }
    if(track){
      va.track('liquid staking', { pool,amount: Number(sol.toString()) / LAMPORTS_PER_SOL, validatorVoteAccount });
    }
  }

  public async marinadeNativeStake(amountLamports) {
    try {
      const walletOwnerPK = this._solanaUtilsService.getCurrentWallet().publicKey
      const versionedTransaction = await getRefNativeStakeSOLTx(walletOwnerPK, amountLamports, '3j0t4wyu')
      // sign and send the `transaction`
      await this._txInterceptService.sendTxV2(versionedTransaction)
      va.track('marinade native stake', {amount: amountLamports / LAMPORTS_PER_SOL});
    } catch (error) {
      console.error(error)
    }
  }
  private async _marinadeStakeSOL(sol: BN, walletOwner, validatorVoteAccount: string) {
    const directToValidatorVoteAddress = validatorVoteAccount ? new PublicKey(validatorVoteAccount) : null;
    const { transaction } = await this.marinadeSDK.deposit(sol, { directToValidatorVoteAddress });
    await this._txInterceptService.sendTx([transaction], walletOwner.publicKey)
  }
  private async _stakePoolStakeSOL(poolPublicKey: PublicKey, walletOwner: WalletExtended, sol: BN, validatorVoteAccount: string) {
    let ix = await depositSol(
      this._solanaUtilsService.connection,
      poolPublicKey,
      walletOwner.publicKey,
      Number(sol),
      undefined,
      // referral
      new PublicKey(environment.platformATAbSOLFeeCollector)
    );
    const stakeCLS = (validatorVoteAccount: string) => {

      let memo = JSON.stringify({
        type: "cls/validator_stake/lamports",
        value: {
          validator: new PublicKey(validatorVoteAccount)
        }
      });
      let memoInstruction = new TransactionInstruction({
        keys: [{
          pubkey: walletOwner.publicKey,
          isSigner: true,
          isWritable: true
        }],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: (new TextEncoder()).encode(memo) as Buffer
      })
      return memoInstruction

    }
    let ixs: any[] = [ix]
    if (validatorVoteAccount) {
      const ix2 = stakeCLS(validatorVoteAccount);
      ixs.push(ix2)
    }
    const txId = await this._txInterceptService.sendTx(ixs, walletOwner.publicKey, ix.signers);
    fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${validatorVoteAccount}&txid=${txId}`);
    fetch(`https://stake.solblaze.org/api/v1/referral_stake?ref=${environment.platformFeeCollector}&txid=${txId}`);
  }


  public async getStakePoolInfo(poolAddress: PublicKey): Promise<{ totalStake: number, totalSupply: number, conversion: number }> {
    let info = await stakePoolInfo(this._solanaUtilsService.connection, poolAddress);

    let solanaAmount = info.details.reserveStakeLamports;
    for (let i = 0; i < info.details.stakeAccounts.length; i++) {
      solanaAmount += parseInt(info.details.stakeAccounts[i].validatorLamports);
    }
    let tokenAmount = parseInt(info.poolTokenSupply);
    let conversion = solanaAmount / tokenAmount;
    // console.log(`Conversion: 1 bSOL = ${conversion} SOL`);

    // console.log(`Total staked SOL (TVL): ${solanaAmount / LAMPORTS_PER_SOL}`);
    // console.log(`Total bSOL (Supply): ${tokenAmount / LAMPORTS_PER_SOL}`);
    const totalStake = solanaAmount / LAMPORTS_PER_SOL;
    const totalSupply = tokenAmount / LAMPORTS_PER_SOL
    return { totalStake, totalSupply, conversion }
  }
}
