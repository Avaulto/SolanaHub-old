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


}
