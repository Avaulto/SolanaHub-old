import { Injectable } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { Authorized, BlockheightBasedTransactionConfirmationStrategy, CreateStakeAccountParams, DelegateStakeParams, Keypair, LAMPORTS_PER_SOL, Lockup, PublicKey, sendAndConfirmTransaction, StakeProgram, SystemProgram, Transaction, TransactionBlockhashCtor, TransactionInstruction } from '@solana/web3.js';
import { throwError } from 'rxjs';
import { toastData } from '../models';
import { SolanaUtilsService } from './solana-utils.service';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root'
})
export class TxInterceptService {

  constructor(
    private toasterService: ToasterService,
    private solanaUtilsService: SolanaUtilsService,
    private _walletStore: WalletStore,
  ) {
  }
  // catch error
  private _formatErrors(error: any) {
    console.log(error);
    this.toasterService.msg.next({
      message: error.message,
      icon: 'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError(error);
  }

  public async verifyBalance(lamportToSend: number, walletPubkey: PublicKey, transaction: Transaction) {
    const balance = await this.solanaUtilsService.connection.getBalance(walletPubkey);
    const txFee = (await this.solanaUtilsService.connection.getFeeForMessage(
      transaction.compileMessage(),
      'confirmed',
    )).value;
    const balanceCheck = lamportToSend < balance + txFee ? true : false;
    if (!balanceCheck) {
      this._formatErrors({ message: 'not enogh balance' })
      // throw new Error('not enogh balance')
      return false;
    }
    return balanceCheck
  }
  private async prepTx(lamports: number, tx: Transaction | TransactionInstruction, walletOwnerPk: PublicKey) {
    // verify tx fee
    const { blockhash } = await this.solanaUtilsService.connection.getLatestBlockhash();
    const txVerify = new Transaction().add(tx)
    txVerify.recentBlockhash = blockhash;
    txVerify.feePayer = walletOwnerPk

    const hasBalance = await this.verifyBalance(lamports, walletOwnerPk, txVerify)
    if (hasBalance) {
      return true
    } else {
      return false
    }
  }

  public async deactivateStakeAccount(stakeAccount: string, walletOwnerPk:PublicKey){
    const deactivateTx: Transaction = StakeProgram.deactivate({
      stakePubkey: new PublicKey(stakeAccount),
      authorizedPubkey: walletOwnerPk,
    });
    console.log(deactivateTx)
      this.sendTx([deactivateTx], walletOwnerPk)
    

  }
  public async delegate(lamportsToDelegate: number, walletOwnerPk: PublicKey, validatorVoteKey: string) {
    const minimumAmount = await this.solanaUtilsService.connection.getMinimumBalanceForRentExemption(
      StakeProgram.space,
    );
    if(lamportsToDelegate < minimumAmount){
      return this._formatErrors({message:`minimum size for stake account creation is: ${minimumAmount / LAMPORTS_PER_SOL} sol`})
    }

    const createStakeAccount = async (lamportToSend: number, stakeAccountOwner: PublicKey) => {
  
      const fromPubkey = stakeAccountOwner;
      const newStakeAccount = new Keypair();
      const authorizedPubkey = stakeAccountOwner;
      const authorized = new Authorized(authorizedPubkey, authorizedPubkey);
      const lockup = new Lockup(0, 0, fromPubkey);
      const lamports = lamportToSend;
      const stakeAccountIns: CreateStakeAccountParams = {
        fromPubkey,
        stakePubkey: newStakeAccount.publicKey,
        authorized,
        lockup,
        lamports
      }
      const newStakeAccountIns = StakeProgram.createAccount(stakeAccountIns)
      return { newStakeAccountIns, newStakeAccount }
    }
    try {
      const stakeAccountData = await createStakeAccount(lamportsToDelegate, walletOwnerPk)
      const stakeAcc: Keypair = stakeAccountData.newStakeAccount;
      const instruction: DelegateStakeParams = {
        stakePubkey: stakeAcc.publicKey,
        authorizedPubkey: walletOwnerPk,
        votePubkey: new PublicKey(validatorVoteKey)
      }
      const stakeAccIns: Transaction = stakeAccountData.newStakeAccountIns;
      const delegateTX: Transaction = StakeProgram.delegate(instruction);

      const stake: Transaction[] = [stakeAccIns, delegateTX]
      const validTx = await this.prepTx(lamportsToDelegate,delegateTX, walletOwnerPk)


      if (validTx) {
        this.sendTx(stake, walletOwnerPk, [stakeAcc])
      }
    } catch (error) {
      console.log(error)
    }

  }
  public async sendSol(lamportsToSend: number, toAddress: PublicKey, walletOwnerPk: PublicKey): Promise<any> {
    const transfer: TransactionInstruction =
      SystemProgram.transfer({
        fromPubkey: walletOwnerPk,
        toPubkey: toAddress,
        lamports: lamportsToSend,
      })
    const validTx = await this.prepTx(lamportsToSend, transfer, walletOwnerPk)
    if (validTx) {
      this.sendTx([transfer], walletOwnerPk)
    }
  }
  public async sendTx(txParam: TransactionInstruction[] | Transaction[], walletPk: PublicKey, extraSigners?: Keypair[]) {
    try {
      const { lastValidBlockHeight, blockhash } = await this.solanaUtilsService.connection.getLatestBlockhash();
      const txArgs: TransactionBlockhashCtor = { feePayer: walletPk, blockhash, lastValidBlockHeight: lastValidBlockHeight }
      let transaction: Transaction = new Transaction(txArgs).add(...txParam);
      // this._walletStore.signTransaction(transaction);
      this._walletStore.signTransaction(transaction).subscribe({
        next: async (res: Transaction) => {

          if (extraSigners) transaction.partialSign(...extraSigners);

          //LMT: check null signatures
          for (let i = 0; i < transaction.signatures.length; i++) {
            if (!transaction.signatures[i].signature) {
              throw Error(`missing signature for ${transaction.signatures[i].publicKey.toString()}. Check .isSigner=true in tx accounts`)
            }
          }

          const rawTransaction = transaction.serialize({ requireAllSignatures: false });
          const signature = await this.solanaUtilsService.connection.sendRawTransaction(rawTransaction);
          console.log('https://solscan.io/tx/' + signature)
          const txSend: toastData = {
            message: 'transaction subbmitted',
            icon: 'information-circle-outline',
            segmentClass: "toastInfo"
          }
          this.toasterService.msg.next(txSend)
          const config: BlockheightBasedTransactionConfirmationStrategy = {
            signature, blockhash, lastValidBlockHeight: res.lastValidBlockHeight//.lastValidBlockHeight
          }
          await this.solanaUtilsService.connection.confirmTransaction(config) //.confirmTransaction(txid, 'confirmed');
          const txCompleted: toastData = {
            message: 'transaction completed',
            icon: 'information-circle-outline',
            segmentClass: "toastInfo"
          }
          this.toasterService.msg.next(txCompleted)
        },
        error: (err) => {
          this._formatErrors(err)
        },
      })

    } catch (error) {
      console.log(error)
      // onMsg('transaction failed', 'error')
    }
  }
}
