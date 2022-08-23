import { Injectable } from '@angular/core';
import { ConnectionStore } from '@heavy-duty/wallet-adapter';
import { AccountInfo, clusterApiUrl, ConfirmedSignatureInfo, Connection, GetProgramAccountsFilter, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey, StakeActivationData, Transaction } from '@solana/web3.js';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StakeAccountExtended } from '../shared/models/stakeAccountData.model';
import { ApiService } from './api.service';
import { ToasterService } from './toaster.service';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ValidatorData } from '../shared/models/validatorData.model';
import { UtilsService } from './utils.service';
import { TokenBalance } from '../shared/models/tokenBalance.model';


interface StakeWizEpochInfo {
  epoch: number,
  start_slot: number,
  start_time: Date,
  slot_height: number,
  duration_seconds: number,
  elapsed_seconds: number,
  remaining_seconds: number,
  epochs_per_year: number,
  timepassInPercentgae?: number,
  ETA?: string;
}
@Injectable({
  providedIn: 'root'
})
export class SolanaUtilsService {
  public connection: Connection;
  private validatorsData: BehaviorSubject<ValidatorData[]> = new BehaviorSubject([] as ValidatorData[]);
  public currentValidatorData = this.validatorsData.asObservable();
  constructor(
    private apiService: ApiService,
    private toasterService: ToasterService,
    private _connectionStore: ConnectionStore,
    private utilService: UtilsService
  ) {
    this._connectionStore.connection$.subscribe(conection => this.connection = conection);
    // this._connectionStore.connection$.subscribe(con => this.connection$.next(con));
    // console.log(this.connection$.sub)
    // this.connection$
  }

  private _formatErrors(error: any) {
    console.log('my err', error)
    this.toasterService.msg.next({
      message: error.message,
      icon: 'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError(error);
  }
  public getValidatorData(vote_identity: string = ''): Observable<any> {
    return this.apiService.get(`https://api.stakewiz.com/validators/${vote_identity}`).pipe(
      map((validators) => {
        const filteredValidators: ValidatorData[] = validators.map(validator => {
          return {
            name: validator.name || '',
            image: validator.image || '/assets/images/icons/node-placeholder.svg',
            vote_identity: validator.vote_identity,
            website: validator.website,
            wizScore: validator.wiz_score,
            commission: validator.commission,
            apy_estimate: validator.apy_estimate,
            uptime: validator.uptime
          }
        })
        this.validatorsData.next(filteredValidators);
        return filteredValidators;
      }),
      catchError(this._formatErrors)
    );
  }
  public getAvgApy() {
    return this.apiService.get(`https://api.stakewiz.com/cluster_stats`).pipe(
      map((clusterInfo) => {
        const { avg_apy } = clusterInfo;

        return avg_apy
      }),
      catchError(this._formatErrors)
    );
  }
  public async getStakeAccountsByOwner(publicKey: PublicKey): Promise<Array<{
    pubkey: PublicKey;
    account: AccountInfo<Buffer | ParsedAccountData | any>;
  }> | any> {
    try {

      // get stake account
      const stakeAccounts: Array<{
        pubkey: PublicKey;
        account: AccountInfo<Buffer | ParsedAccountData | any>;
      }> = await this.connection.getParsedProgramAccounts(new PublicKey("Stake11111111111111111111111111111111111111"), {

        "filters": [
          {
            "memcmp": {
              "offset": 12,
              "bytes": publicKey.toBase58()
            }
          }
        ]
      })



      return stakeAccounts;
    } catch (error) {
      return new Error(error)
    }
    // return [];
  }

  public async extendStakeAccount(account: { pubkey: PublicKey; account: AccountInfo<Buffer | ParsedAccountData | any> }): Promise<any> {
    const pk = account.pubkey;
    const addr = pk.toBase58()
    const stake = account.account.data.parsed.info.stake.delegation.stake
    const validatorVoteKey = account.account.data.parsed.info.stake.delegation.voter
    const { active, state }: StakeActivationData = await this.connection.getStakeActivation(pk);

    const validatorData = this.validatorsData.value.filter(validator => validator.vote_identity == validatorVoteKey)[0]
    const stakeAccountInfo: StakeAccountExtended = {
      addr,
      shortAddr: this.utilService.addrUtil(addr).addrShort,
      balance: this.utilService.shortenNum(Number((stake / LAMPORTS_PER_SOL)),3),
      state,
      validatorData
    }
    return stakeAccountInfo
  }


  public async getTokensAccountbyOwner(publicKey: PublicKey) {
    const accounts = await this.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID, // new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      {
        filters: [
          {
            dataSize: 165, // number of bytes
          },
          {
            memcmp: {
              offset: 32, // number of bytes
              bytes: publicKey.toBase58(), // base58 encoded string
            },
          },
        ],
      })
    return accounts;
  }
  public async getSupply(): Promise<{ circulating: any, noneCirculating: any }> {
    const supply = await this.connection.getSupply({ excludeNonCirculatingAccountsList: true, commitment: "finalized" });
    const circulating = this.utilService.numFormater(supply.value.circulating / LAMPORTS_PER_SOL)
    const noneCirculating = this.utilService.numFormater(supply.value.nonCirculating / LAMPORTS_PER_SOL)

    return { circulating, noneCirculating }
  }
  public async getStake(): Promise<{ activeStake, delinquentStake }> {
    const stakeInfo = await this.connection.getVoteAccounts()
    const activeStake = this.utilService.numFormater(stakeInfo.current.reduce(
      (previousValue, currentValue) => previousValue + currentValue.activatedStake,
      0
    ) / LAMPORTS_PER_SOL)
    const delinquentStake = this.utilService.numFormater(stakeInfo.delinquent.reduce(
      (previousValue, currentValue) => previousValue + currentValue.activatedStake,
      0
    ) / LAMPORTS_PER_SOL)
    return { activeStake, delinquentStake }
  }
  public async getTPS(): Promise<any> {
    const performaceRes = (await this.connection.getRecentPerformanceSamples())[0];
    const tps = performaceRes.numTransactions / performaceRes.samplePeriodSecs

    return tps
  }
  public getEpochInfo(): Observable<StakeWizEpochInfo> {
    return this.apiService.get(`https://api.stakewiz.com/epoch_info`).pipe(
      map((data: StakeWizEpochInfo) => {
        const { remaining_seconds, elapsed_seconds, duration_seconds } = data
        const days = Math.floor(remaining_seconds / 86400);
        const hours = Math.floor(remaining_seconds / 3600) - (days * 24);
        data.ETA = `ETA ${days} Days and ${hours} Hours`
        data.timepassInPercentgae = elapsed_seconds / duration_seconds
        return data
      }),
      catchError(this._formatErrors)
    );
  }
  async getWalletHistory(walletPubKey: PublicKey) {
    try {
      const signatures: ConfirmedSignatureInfo[] = await this.connection.getConfirmedSignaturesForAddress2(walletPubKey);
      let records: any[] = [];
      let walletHistory = []
      console.log(signatures)
      signatures.forEach(async signature => {
        const txInfo = await this.connection.getTransaction(signature.signature);
        console.log(txInfo)
        records.push(txInfo);
      });
      records.forEach((record, i) => {
        const from = record?.transaction?.instructions[0]?.keys[0]?.pubkey.toBase58() || null;
        const to = record.transaction?.instructions[0]?.keys[1]?.pubkey.toBase58() || null;;
        const amount = (record.meta?.postBalances[1] - record.meta?.preBalances[1]) / LAMPORTS_PER_SOL || null;
        walletHistory.push({ signature: signatures[i].signature, block: record.slot, amount, from, to } || null)
      });
      return walletHistory;
    } catch (error) {
      console.error(error)
      this.toasterService.msg.next({ message: 'failed to retrieve transaction history', icon: '', segmentClass: 'toastError' })
    }
  }

  public async getTokenAccountsBalance(wallet: string): Promise<TokenBalance[]> {
    const filters: GetProgramAccountsFilter[] = [
      {
        dataSize: 165,    //size of account (bytes)
      },
      {
        memcmp: {
          offset: 32,     //location of our query in the account (bytes)
          bytes: wallet,  //our search criteria, a base58 encoded string
        }
      }
    ];
    const accounts = await this.connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,   //SPL Token Program, new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
      { filters: filters }
    );
    console.log(accounts)
    // console.log(`Found ${accounts.length} token account(s) for wallet ${wallet}.`);
    const tokensBalance: TokenBalance[] = accounts.map((account, i) => {
      //Parse the account data
      const parsedAccountInfo: any = account.account.data;
      const mintAddress: string = parsedAccountInfo["parsed"]["info"]["mint"];
      const balance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
      return { tokenPubkey: account.pubkey.toString(), mintAddress, balance }
    }).filter(token => token.balance > 0.00001);
    return tokensBalance;
    //   const data = {
    //     pubkey: PublicKey,      //Token Account Public Key
    //     account: AccountInfo    //Object including information about our token account
    // }[]

  }

}
