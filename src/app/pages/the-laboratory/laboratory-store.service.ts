import { Injectable } from '@angular/core';
import { StakePoolStoreService } from '../defi/dapps/liquid-stake/stake-pool-store.service';
import { ApiService, JupiterStoreService, SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';
import { depositSol, withdrawStake } from '@solana/spl-stake-pool';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { toastData } from 'src/app/models';
import { SolendMarket, SolendAction, SolendWallet } from '@solendprotocol/solend-sdk'
import BN from 'bn.js';

@Injectable({
  providedIn: 'root'
})
export class LaboratoryStoreService {
  protected solblazePoolAddress = new PublicKey("stk9ApL5HeVAwPLr3TLhDXdZS8ptVu7zp6ov8HFDuMi");
  protected avaultoVoteKey = new PublicKey('7K8DVxtNJGnMtUY1CQJT5jcs8sFGSZTDiG7kowvFpECh');
  protected solendStakedSolPool = new PublicKey('HPzmDcPDCXAarsAxx3qXPG7aWx447XUVYwYsW4awUSPy');

  constructor(
    private _apiService: ApiService,
    private _solanaUtilsService: SolanaUtilsService,
    private _jupStore: JupiterStoreService,
    private _stakePoolStore: StakePoolStoreService,
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService
  ) { }

  // stake with solblaze with Avaulto as custom liquid stake
  // land those SOL on solend
  // borrow SOL against
  // Stake those SOL

  initRecursiveStake() {

  }
  // step 1 - stake
  private async _bSolStake(amount: number): Promise<TransactionInstruction[]> {
    const validator = this.avaultoVoteKey;
    const walletOwner = this._solanaUtilsService.getCurrentWallet().publicKey;
    const deposit = await this._stakePoolStore.stakePoolSDK.depositSol(
      this._solanaUtilsService.connection,
      this.solblazePoolAddress,
      walletOwner,
      amount
    )
    try {


      let memo = JSON.stringify({
        type: "cls/validator_stake/lamports",
        value: {
          validator
        }
      });
      let memoInstruction = new TransactionInstruction({
        keys: [{
          pubkey: walletOwner,
          isSigner: true,
          isWritable: true
        }],
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        data: (new TextEncoder()).encode(memo) as Buffer
      })

      const txIns: TransactionInstruction[] = [...deposit.instructions, memoInstruction]
      return txIns
      // await this._txInterceptService.sendTx([...deposit.instructions, memoInstruction], 
      //   walletOwner, deposit.signers);
      // await fetch(`https://stake.solblaze.org/api/v1/cls_stake?validator=${validator}&txid=${txId}`);

    } catch (error) {
      const toasterMessage: toastData = {
        message: error.toString().substring(6),
        segmentClass: "toastError"
      }
      this._toasterService.msg.next(toasterMessage)
    }
  }
  private async _mSolStake(amount: any): Promise<Transaction | any> {
    const directToValidatorVoteAddress = this.avaultoVoteKey;
    const { transaction } = await this._stakePoolStore.marinadeSDK.deposit(amount, { directToValidatorVoteAddress });
    return transaction;
  }
  // step 2 - push as collateral on solend


  public async initSolendMarket(walletOwner: PublicKey) {
    const market = await SolendMarket.initialize(
      this._solanaUtilsService.connection,
      //environment.solanaEnv as any, // optional environment argument
    );
    console.log(market.reserves);

    // 2. Read on-chain accounts for reserve data and cache
    await market.loadReserves();

    const usdcReserve = market.reserves.find((res) => res.config.liquidityToken.symbol == "mSOL");
    console.log(usdcReserve);

    // // Read Solend liquidity mining stats
    // await market.loadRewards();
    // console.log(usdcReserve.stats); // {apy: 0.07, rewardMint: "SLND...

    // // Refresh all cached data
    // market.refreshAll();

    // const obligation = await market.fetchObligationByWallet(walletOwner);
    // console.log(obligation);
  }

  // deposit mSOL to solend pool
  public async depositMsol(amountBase: BN, walletOwner: PublicKey) {
    const solendAction = await SolendAction
    .buildDepositTxns(
      this._solanaUtilsService.connection,
      amountBase,
      'mSOL',
      walletOwner,
      //environment.solanaEnv as any,
    );

    return solendAction

  }
    // withdraw mSOL to solend pool
    public async withdrawMsol(amountBase: BN, walletOwner: PublicKey) {
      const solendAction = await SolendAction
      .buildWithdrawTxns(
        this._solanaUtilsService.connection,
        amountBase,
        'mSOL',
        walletOwner,
      );
  
      return solendAction
    }

  public async claimMNDE(walletOwner: PublicKey) {

    const solendWallet = await SolendWallet.initialize(walletOwner as any, this._solanaUtilsService.connection);

    // Claim rewards
    const mndeRewards = solendWallet.rewards["MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"];
    console.log(
      "Claimable rewards:",
      mndeRewards.claimableAmount
    );

    const sig1 = await mndeRewards.rewardClaims
      .find((claim) => !claim.metadata.claimedAt)
      ?.claim();

    // Exercise options (after claiming)
    const slndOptionClaim = solendWallet.rewards["SLND_OPTION"].rewardClaims.find(
      (claim) => claim.metadata.optionMarket.userBalance
    );

    // const sig2 = await slndOptionClaim.exercise(
    //   slndOptionClaim.optionMarket.userBalance
    // );

    const [setupIxs, claimIxs] = await solendWallet.getClaimAllIxs();
    // Claim all claimable rewards
  }
}
