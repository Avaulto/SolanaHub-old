import { Component } from '@angular/core';
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as bs58 from "bs58";
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() { }
  async ngOnInit(): Promise<void> {
    (async () => {
      // connection
      // const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    
      const owner = new PublicKey("JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD");
      // let response = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });
    

      const publicAddress = await resolveToWalletAddress({
        text: 'JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD'
      });
      
      const nftArray = await getParsedNftAccountsByOwner({
        publicAddress,
      });
      console.log(nftArray)

    })();

    
  }

}
