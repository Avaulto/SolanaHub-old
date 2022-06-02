import { Injectable } from '@angular/core';
import { AccountInfo, clusterApiUrl, Connection, LAMPORTS_PER_SOL, ParsedAccountData, PublicKey, StakeActivationData } from '@solana/web3.js';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ToasterService } from './toaster.service';

interface stakeAccountInfo {
  addr: string;
  shortAddr?: string;
  balance: number;
  state: 'active' | 'inactive' | 'activating' | 'deactivating';
  validatorInfo: {
    name:  string;
    fee: number,
    uptime: number,
    image: string
  },
}
@Injectable({
  providedIn: 'root'
})
export class SolanaFunctionsService {

  constructor(private apiService:ApiService, private toasterService:ToasterService) { }
  protected _solanaAPI = clusterApiUrl('mainnet-beta');
  private solWallet = new Connection(clusterApiUrl('testnet'))
  private formatErrors(error: any) {
    console.log('my err', error)
    this.toasterService.msg.next({
      message: error.message,
      icon:'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError(error);
  }


  public async getStakeAccountsInfo(publicKey: PublicKey){ 
    const sortedStakeAccounts: stakeAccountInfo[] = []
    const stakeAccounts: Array<{
      pubkey: PublicKey;
      account: AccountInfo<Buffer | ParsedAccountData | any>;
    }> = await this.solWallet.getParsedProgramAccounts(new PublicKey("Stake11111111111111111111111111111111111111"), {
     
      "filters": [
        {
          "memcmp": {
            "offset": 12,
            "bytes": publicKey.toBase58()
          }
        }
      ]
    })
    stakeAccounts.forEach( async account =>{
      const pk = account.pubkey;
      const addr = pk.toBase58()
      const stake = account.account.data.parsed.info.stake.delegation.stake 
      const {active, state}: StakeActivationData = await this.solWallet.getStakeActivation(pk);
      const stakeAccountInfo: stakeAccountInfo = {
        addr,
        balance: stake / LAMPORTS_PER_SOL,
        state,
        validatorInfo: {
          name: 'Avaulto',
          fee: 5,
          uptime: 100,
          image: 'https://s3.amazonaws.com/keybase_processed_uploads/b543f95c3eca42f8c539b1a26624ff05_360_360.jpg'
        },
      }
      console.log(stakeAccountInfo, stake)
      sortedStakeAccounts.push(stakeAccountInfo)
    })
    console.log(sortedStakeAccounts)

    return stakeAccounts;
  } 
  public getStakeAccountsByOwner(publicKey: PublicKey): Observable<[]> {
    var raw = {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getProgramAccounts",
      "params": [
        "Stake11111111111111111111111111111111111111",

        {
          "encoding": "jsonParsed",
          "filters": [
            {
              "memcmp": {
                "offset": 12,
                "bytes": publicKey.toBase58()
              }
            }
          ]
        }
      ]
    }
    return this.apiService.post(this._solanaAPI, raw).pipe(
      map((data) => {
        console.log('api call',data)
        return data.result;
      }),
      catchError((error) => this.formatErrors(error))
    );
  }
}
