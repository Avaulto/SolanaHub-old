import { Injectable } from '@angular/core';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import {
  TOKEN_PROGRAM_ID,
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TokenOwnerOffCurveError
} from '../../../node_modules/@solana/spl-token';;
import {
  Authorized,
  BlockheightBasedTransactionConfirmationStrategy,
  ComputeBudgetProgram,
  CreateStakeAccountParams,
  DelegateStakeParams,
  Keypair,
  LAMPORTS_PER_SOL,
  Lockup,
  PublicKey,
  Signer,
  StakeProgram,
  SystemProgram,
  Transaction,
  TransactionBlockhashCtor,
  TransactionInstruction
} from '@solana/web3.js';
import { firstValueFrom, throwError } from 'rxjs';
import { toastData } from '../models';
import { ToasterService, SolanaUtilsService, UtilsService } from './';
import { PriorityFee } from '../models/priorityFee.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TxInterceptService {

  constructor(
    private toasterService: ToasterService,
    private solanaUtilsService: SolanaUtilsService,
    private _walletStore: WalletStore,
    private _utilsService: UtilsService
  ) {
  }
  // catch error
  private _formatErrors(error: any) {
    const toastData: toastData = {
      message: error.message,
      icon: 'alert-circle-outline',
      segmentClass: "toastError",

    }
    this.toasterService.msg.next(toastData);
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

  public async deactivateStakeAccount(stakeAccount: string, walletOwnerPk: PublicKey) {
    const deactivateTx: Transaction = StakeProgram.deactivate({
      stakePubkey: new PublicKey(stakeAccount),
      authorizedPubkey: walletOwnerPk,
    });
    await this.sendTx([deactivateTx], walletOwnerPk)


  }
  public async mergeStakeAccounts(walletOwnerPk: PublicKey, sourceStakePubKey: PublicKey[], targetStakePubkey: PublicKey,) {


    const mergeAccounts: Transaction[] = sourceStakePubKey.map(sourceAcc => {
      return StakeProgram.merge({
        authorizedPubkey: walletOwnerPk,
        sourceStakePubKey: sourceAcc,
        stakePubkey: targetStakePubkey,
      });
    })

    this.sendTx(mergeAccounts, walletOwnerPk)
  }

  public async withdrawStake(stakeAccount: string, walletOwnerPk: PublicKey, lamports: number): Promise<void> {
    const withdrawTx = StakeProgram.withdraw({
      stakePubkey: new PublicKey(stakeAccount),
      authorizedPubkey: walletOwnerPk,
      toPubkey: walletOwnerPk,
      lamports, // Withdraw the full balance at the time of the transaction
    });
    // try {
    //   const validTx = await this.prepTx(lamports, withdrawTx, walletOwnerPk)
    //   if (validTx) {
    this.sendTx([withdrawTx], walletOwnerPk)
    //   }
    // } catch (error) {
    //   console.error(error)
    // }
  }
  async getOrCreateTokenAccountInstruction(mint: PublicKey, user: PublicKey, payer: PublicKey | null = null): Promise<TransactionInstruction | null> {
    try {
      const userTokenAccountAddress = await getAssociatedTokenAddress(mint, user, false);
      const userTokenAccount = await this.solanaUtilsService.connection.getParsedAccountInfo(userTokenAccountAddress);
      if (userTokenAccount.value === null) {
        return createAssociatedTokenAccountInstruction(payer ? payer : user, userTokenAccountAddress, user, mint);
      } else {
        return null;
      }
    } catch (error) {
      console.warn(error)
      return
      // this._formatErrors()
    }
  }
  public async sendSplOrNft(mintAddressPK: PublicKey, walletOwner: PublicKey, toWallet: string, amount: number) {
    try {
      const toWalletPK = new PublicKey(toWallet);
      const ownerAta = await this.getOrCreateTokenAccountInstruction(mintAddressPK, walletOwner, walletOwner);
      const targetAta = await this.getOrCreateTokenAccountInstruction(mintAddressPK, toWalletPK, walletOwner);
      const tokenAccountSourcePubkey = await getAssociatedTokenAddress(mintAddressPK, walletOwner);
      const tokenAccountTargetPubkey = await getAssociatedTokenAddress(mintAddressPK, toWalletPK);

      const decimals = await (await this.solanaUtilsService.connection.getParsedAccountInfo(mintAddressPK)).value.data['parsed'].info.decimals;

      const transferSplOrNft = createTransferCheckedInstruction(
        tokenAccountSourcePubkey,
        mintAddressPK,
        tokenAccountTargetPubkey,
        walletOwner,
        amount,
        decimals,
        [],
        TOKEN_PROGRAM_ID
      )
      const instructions: TransactionInstruction[] = [ownerAta, targetAta, transferSplOrNft].filter(i => i !== null) as TransactionInstruction[];
      this.sendTx(instructions, walletOwner)
    } catch (error) {

      const res = new TokenOwnerOffCurveError()
      console.error(error, res)
      this._formatErrors(error)
    }
  }
  public async delegate(lamportsToDelegate: number, walletOwnerPk: PublicKey, validatorVoteKey: string, lockuptime: number) {
    const minimumAmount = await this.solanaUtilsService.connection.getMinimumBalanceForRentExemption(
      StakeProgram.space,
    );
    if (lamportsToDelegate < minimumAmount) {
      return this._formatErrors({ message: `minimum size for stake account creation is: ${minimumAmount / LAMPORTS_PER_SOL} sol` })
    }

    const createStakeAccount = async (lamportToSend: number, stakeAccountOwner: PublicKey) => {

      const fromPubkey = stakeAccountOwner;
      const newStakeAccount = new Keypair();
      const authorizedPubkey = stakeAccountOwner;
      const authorized = new Authorized(authorizedPubkey, authorizedPubkey);
      const lockup = new Lockup(lockuptime, 0, fromPubkey);
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
      const validTx = await this.prepTx(lamportsToDelegate, delegateTX, walletOwnerPk)


      if (validTx) {
        this.sendTx(stake, walletOwnerPk, [stakeAcc])
      }
    } catch (error) {
      console.warn(error)
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
  private _addPriorityFee(priorityFee: PriorityFee): TransactionInstruction[] | null {
    if (priorityFee != '0') {
      const units = Number(priorityFee) * 1000000;
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units
      });
      
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1
      });
      return [modifyComputeUnits, addPriorityFee]
    }
    return null
  }
  public async sendTx(txParam: TransactionInstruction[] | Transaction[], walletPk: PublicKey, extraSigners?: Keypair[] | Signer[]) {

    try {
      const { lastValidBlockHeight, blockhash } = await this.solanaUtilsService.connection.getLatestBlockhash();
      const txArgs: TransactionBlockhashCtor = { feePayer: walletPk, blockhash, lastValidBlockHeight: lastValidBlockHeight }
      let transaction: Transaction = new Transaction(txArgs).add(...txParam);
      const priorityFeeInst = this._addPriorityFee(this._utilsService.priorityFee)
      if (priorityFeeInst?.length > 0) transaction.add(...priorityFeeInst)
      console.log(transaction)

      // this._walletStore.signTransaction(transaction);
      const res = await firstValueFrom(this._walletStore.signTransaction(transaction));

      if (extraSigners?.length > 0) transaction.partialSign(...extraSigners);

      //LMT: check null signatures
      for (let i = 0; i < transaction.signatures.length; i++) {
        if (!transaction.signatures[i].signature) {
          throw Error(`missing signature for ${transaction.signatures[i].publicKey.toString()}. Check .isSigner=true in tx accounts`)
        }
      }
      const rawTransaction = transaction.serialize({ requireAllSignatures: false });
      const signature = await this.solanaUtilsService.connection.sendRawTransaction(rawTransaction);
      const url = `${this._utilsService.explorer}/tx/${signature}?cluster=${environment.solanaEnv}`
      const txSend: toastData = {
        message: 'click on the icon to view transaction on explorer',
        icon: 'exit-outline',
        segmentClass: "toastInfo",
        duration: 10000,
        cb: () => window.open(url)
      }
      this.toasterService.msg.next(txSend)
      const config: BlockheightBasedTransactionConfirmationStrategy = {
        signature, blockhash, lastValidBlockHeight: res.lastValidBlockHeight//.lastValidBlockHeight
      }
      await this.solanaUtilsService.connection.confirmTransaction(config, 'finalized') //.confirmTransaction(txid, 'confirmed');
      const txCompleted: toastData = {
        message: 'transaction completed',
        icon: 'information-circle-outline',
        segmentClass: "toastInfo"
      }
      this.toasterService.msg.next(txCompleted)

      return signature

    } catch (error) {
      console.warn(error)
      return null
      // onMsg('transaction failed', 'error')
    }
  }
}
