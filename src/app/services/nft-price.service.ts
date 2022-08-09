import { Injectable } from '@angular/core';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Observable } from 'rxjs';
import { MECollectionStats, ParsedNftData, SolanaPriceData } from '../models';
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
    private magicEdenAPI_tokens='https://api-mainnet.magiceden.dev/v2/tokens/';
    private magicEdenAPI_collection='https://api-mainnet.magiceden.dev/v2/collections/'

    constructor() { }

    //@symbol <string> is collection symbol
    async getCollectionStats(symbol: string){
        try{
            if(!symbol){
                throw new Error("No Symbol");
            }

            let url=this.magicEdenAPI_collection + symbol +'/stats';
        let meCollectionStats: MECollectionStats = await fetch(url, {method: 'GET', mode: 'cors', credentials: 'same-origin'}).then(response=>{
            return response.json()
        })
            return meCollectionStats;
        }catch{
            return {
                symbol: symbol,
                floorPrice: 0,
                listedCount: 0,
                volumeAll: 0
              }
        }
        
    }


    async getLastPurchasePrice(mint: string){
        try{
            let solData: SolanaPriceData = await fetch(this.requestUrl, {method: 'GET', mode: 'cors', credentials: 'same-origin'}).then(response=>{
                return response.json()
            })
            
            let nftMint =new PublicKey(mint);
            
            //get latest signatures on NFT
            const signatures=await connection.getSignaturesForAddress(nftMint, {limit: 3})
    
            for(let signature of signatures){
    
                //get list of transactions associated with signature
                let transactions=await connection.getParsedTransaction(signature.signature)
    
                for (let transaction of transactions.meta.innerInstructions){
                    
                    let parsedData = transaction.instructions[0] as ParsedNftData;
                    
                    //return latest transaction cost not associated with token account creation.
                    if(!parsedData.parsed.info.newAccount){
                        //console.log(parsedData.parsed.info)
                        return parsedData.parsed.info.lamports/LAMPORTS_PER_SOL*solData.data.price
                    }   
                }
            }
            //no valid transactions found, retrun 0.
            return 0;

        } catch{
            return 0;
        }
        
    }


}




