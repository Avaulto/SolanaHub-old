import { Injectable } from '@angular/core';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Observable } from 'rxjs';
import { ParsedNftData, SolanaPriceData } from '../models';
import { ApiService } from './api.service';

//connection endpoints:
//https://api.mainnet-beta.solana.com 
//https://solana-api.projectserum.com
const connection = new Connection(
    'https://api.mainnet-beta.solana.com ',
    'confirmed',
    );


@Injectable({
    providedIn: "root"
  })

export class NftPriceService{

    private requestUrl = 'https://price.jup.ag/v1/price?id=SOL';

    constructor() { }


    async getFloorPrice(mint:string){
        //get nft symbol via ME api
        //get collection data via symbol

        //return floor price
    }


    async getLastPurchasePrice(mint: string){

        let solData: SolanaPriceData = await fetch(this.requestUrl, {method: 'GET', mode: 'cors', credentials: 'same-origin'}).then(response=>{
            return response.json()
        })
        

        let nftMint =new PublicKey(mint);
        
        //get latest signatures on NFT
        const signatures=await connection.getSignaturesForAddress(nftMint, {limit: 3})

        //loop through signatures to search for non token account creation transactions.
        for(let signature of signatures){

            //get list of transactions associated with signature
            let transactions=await connection.getParsedTransaction(signature.signature)

            //check transaction instructions for SOL cost in lamports, return SOL cost
            for (let transaction of transactions.meta.innerInstructions){

                let parsedData = transaction.instructions[0] as ParsedNftData;

                return parsedData.parsed.info.lamports/LAMPORTS_PER_SOL*solData.data.price
                
            }
        }
        return 0;
    }


}




