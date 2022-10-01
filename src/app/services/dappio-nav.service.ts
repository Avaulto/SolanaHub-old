import { Injectable } from '@angular/core';
import { raydium } from  "@dappio-wonderland/navigator";
import { Connection } from '@solana/web3.js';
import { SolanaUtilsService } from './solana-utils.service';
@Injectable({
  providedIn: 'root'
})
export class DappioNavService {

  constructor(private _solanaUtilsService: SolanaUtilsService) { 
  }

  async fetchRayPools(){
    const connection = new Connection("https://mb-avaulto-cc28.mainnet.rpcpool.com/f72a3ed2-f282-4523-95a0-d4acfcd40f4d", {
  commitment: "confirmed",
});
    const pools = await raydium.infos.getAllPools
    console.log(pools)
  }
}
