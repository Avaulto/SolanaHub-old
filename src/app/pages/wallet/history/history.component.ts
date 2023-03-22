import { Component, OnInit } from '@angular/core';

import { SolanaUtilsService } from 'src/app/services/solana-utils.service';

interface TxHistory{
  type: "sent" | "recevied";
  status: string;
  time:string;
  address: string;
  amount: number;
}
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  public txHistory:TxHistory[]= [
    {
    type:'sent',
    status:'confirm',
    time:'12.10.22',
    address:'0x0a0e...45f5',
    amount: 22.43
  },
  {
    type:'recevied',
    status:'confirm',
    time:'04.08.21',
    address:'0x0a0e...45f5',
    amount: 5223.43
  },
  
  {
    type:'recevied',
    status:'confirm',
    time:'11.04.20',
    address:'0x0a0e...45f5',
    amount: 61115.43
  }
]
  constructor(
    private _solanaUtilsService: SolanaUtilsService,

    ) { }

  ngOnInit() {
    this._getWalletHistory();
  }
  private _getWalletHistory(): void{
    // this._walletStore.anchorWallet$.subscribe(async wallet=>{
    //   const history = await this._solanaUtilsService.getWalletHistory(wallet.publicKey);
    // })
  }
}
