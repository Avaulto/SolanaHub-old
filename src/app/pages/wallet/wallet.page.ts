import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConnectionStore, Wallet, WalletStore } from '@heavy-duty/wallet-adapter';
import { NavController } from '@ionic/angular';
import { getParsedNftAccountsByOwner, resolveToWalletAddress } from '@nfteyez/sol-rayz';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Asset, NFTdata, NFTGroup } from 'src/app/models';
import { ApiService, UtilsService } from 'src/app/services';
import { DataAggregatorService } from 'src/app/services/data-aggregator.service';
import { SolanaUtilsService } from 'src/app/services/solana-utils.service';
import { ValidatorData } from 'src/app/shared/models/validatorData.model';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {
  readonly isReady$ = this._walletStore.connected$
  // nftCollections: NFTGroup[] = []
  // deleteWallet: boolean = false;
  public validatorData: ValidatorData[];
  public stakeAccounts
  public publicKey: PublicKey = null;
  public wallet: Asset ={
    name: 'solana',
    addr: '',
    addrShort: '',
    balance: 0,
    baseOfPortfolio: '50%',
    icon:'/assets/images/Secret.png',
    coinData: {},
    // todo - GET owner tokens from the blockchain
    tokens: [{
      name: 'MNDE',
      addrShort:this.utils.addrUtil('5JsBHVF9p9DWhKYiTV59S3gdeSVXodMmrv9TGoiLVuEY').addrShort,
      addr: '5JsBHVF9p9DWhKYiTV59S3gdeSVXodMmrv9TGoiLVuEY',
      balance: 55148.33,
      // themeCurrency: 5423,
      baseOfPortfolio: '50%',
      icon:'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey/logo.png'
    },
    {
      name: 'RAY',
      addrShort:this.utils.addrUtil('9SYCRB5XoN3bnxCKSD868z3ceav6RFpHeyJtMRYCViw6').addrShort,
      addr: '9SYCRB5XoN3bnxCKSD868z3ceav6RFpHeyJtMRYCViw6',
      balance: 2.25464,
      baseOfPortfolio: '30%',
      icon:'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
    },
    {
      name: 'USDC',
      addrShort: this.utils.addrUtil('GT2vRFB8X1oHcpKwt5EHidFeUX6WUvbxrpfZRqXTEkEe').addrShort,
      addr: 'GT2vRFB8X1oHcpKwt5EHidFeUX6WUvbxrpfZRqXTEkEe',
      balance: 1201,
      baseOfPortfolio: '20%',
      icon:'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
    }]
  }
  constructor(private utils: UtilsService,
    private apiService:ApiService ,
    private dataAggregator:DataAggregatorService,
    private solanaUtilsService: SolanaUtilsService,
    private _connectionStore: ConnectionStore,
    private _walletStore: WalletStore,
    ) { }


  ngOnInit() {
    // this.dataAggregator.getSolWalletData('JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD').subscribe(val =>console.log(val))
    this.dataAggregator.getCoinData(this.wallet.name).subscribe(coinData => this.wallet.coinData = coinData);

    this._walletStore.anchorWallet$.subscribe(async wallet => {
      if(wallet){

        this.setWallet(wallet)
        
          const balanace = await this.solanaUtilsService.connection.getBalance(this.wallet.publicKey);
          this.wallet.balance = Number((balanace / LAMPORTS_PER_SOL).toFixed(3));
        

        // const splAccounts = await this.solanaUtilsService.getTokensAccountbyOwner(this.publicKey)
        // const native = splAccounts.filter(token => token.account.data.)
        // console.log(stakeAccounts)
        // this._getNfts(pk);
      }
    })

  }

  private setWallet(wallet: any){
    const walletAddrs = this.utils.addrUtil(wallet.publicKey.toBase58());
    this.wallet.publicKey = wallet.publicKey;
    this.wallet.addr = walletAddrs.addr
    this.wallet.addrShort = walletAddrs.addrShort
  }
  private _getNfts(pk: PublicKey){
    (async () => {
      let solanaNFTs: NFTGroup = {
        collectionName: 'Marinade Chefs',
        collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image',
        NFTdata: []
      }
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
      nftArray.forEach((item,index) => {
        if(index != 0){

          // console.log('parent:', item)
          this.apiService.get(item.data.uri).subscribe(r => {
            const nft: NFTdata = { collectionName: 'Marinade Chefs', collectionImage: 'https://mnde-nft-api.mainnet-beta.marinade.finance/collection/image', name: item.data.name, image: r.image, description: r.description, mintAddr: item.mint, value: 0, attr: r.attributes, explorerURL: 'https://solscan.io/token/'+item.mint,websiteURL: r.external_url  }
            solanaNFTs.NFTdata.push(nft)
          })
        }
        })
      // this.nftCollections.push(solanaNFTs)
    })();
  }
}
