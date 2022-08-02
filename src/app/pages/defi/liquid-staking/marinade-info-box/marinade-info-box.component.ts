import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { ApiService } from 'src/app/services';
interface MarinadeInfo {
  msolRatio: number,
  apy: number,
  supply: any,
  TVL: any,
  amountOfValidators: number;
}
@Component({
  selector: 'app-marinade-info-box',
  templateUrl: './marinade-info-box.component.html',
  styleUrls: ['./marinade-info-box.component.scss'],
})
export class MarinadeInfoBoxComponent implements OnInit {
  @Output() onMarinadeInfo = new EventEmitter()
  public marinadeInfo: MarinadeInfo = {
    msolRatio: null,
    apy: null,
    supply: null,
    TVL: null,
    amountOfValidators: null
  };
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchMarinadeInfo();
  }
  fetchMarinadeInfo() {
    this.apiService.get('https://api.marinade.finance/msol/apy/1y').subscribe(res => {
      this.marinadeInfo.apy = Number((res.value * 100).toFixed(2));
      this.onMarinadeInfo.emit(this.marinadeInfo)
    });
    this.apiService.get('https://api.marinade.finance/msol/price_sol').subscribe(res => {
      this.marinadeInfo.msolRatio = res.toFixed(4)
      this.onMarinadeInfo.emit(this.marinadeInfo)
    });
    this.apiService.get('https://api.marinade.finance/tlv').subscribe(res => this.marinadeInfo.TVL = res);
    this.apiService.post('https://no-program.marinade.finance/graphql', { query: "\n    query fetchValidators {\n  marinade_validators(use_latest_epoch: true) {\n    vote_address\n    apy\n    name\n    rank\n    avg_active_stake\n    marinade_staked\n  }\n}\n " })
      .subscribe(res => {
        this.marinadeInfo.amountOfValidators = res.data.marinade_validators.length
      });
    this.apiService.get('https://api.marinade.finance/msol/supply').subscribe(res => this.marinadeInfo.supply = (res / LAMPORTS_PER_SOL).toLocaleString());
  }
}
