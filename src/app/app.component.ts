import { Component } from '@angular/core';
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as bs58 from "bs58";
import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import { ApiService, UserService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private apiService: ApiService, private userService:UserService) { }
  async ngOnInit(): Promise<void> {
    this.userService.populate();
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
      this.apiService.get(nftArray[0].data.uri).subscribe(r=>console.log(r))

    })();

    
  }

}
