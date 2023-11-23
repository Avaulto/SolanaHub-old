import { Component, OnInit, ViewEncapsulation } from '@angular/core';
interface Global {
  window: {
    deBridge: any
  };
}
@Component({
  selector: 'app-bridge-to-sol',
  templateUrl: './bridge-to-sol.page.html',
  styleUrls: ['./bridge-to-sol.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BridgeToSolPage implements OnInit {

  constructor() { }

  async ngOnInit() {

    // const swapTrx = await swapFromEvm(quote, 'JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD', 10000, 'JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD', provider, signer)
    //@ts-ignore
    deBridge.widget({"v":"1","element":"debridgeWidget","title":"ETH to LST","description":"swap your asset to a liquid stake SOL and earn 7.5% APY just by holding it","width":"600","height":"800","r":null,"supportedChains":"{\"inputChains\":{\"1\":\"all\",\"10\":\"all\",\"56\":\"all\",\"137\":\"all\",\"8453\":\"all\",\"42161\":\"all\",\"43114\":\"all\",\"59144\":\"all\"},\"outputChains\":{\"7565164\":[\"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So\",\"bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1\"]}}","inputChain":1,"outputChain":7565164,"inputCurrency":"","outputCurrency":"","address":"","showSwapTransfer":false,"amount":"","outputAmount":"","isAmountFromNotModifiable":false,"isAmountToNotModifiable":false,"lang":"en","mode":"deswap","isEnableCalldata":false,"styles":"eyJhcHBCYWNrZ3JvdW5kIjoicmdiYSg2LDI0LDUwLDAuNikiLCJhcHBBY2NlbnRCZyI6InJnYmEoMCwwLDAsMCkiLCJjaGFydEJnIjoiIzA2MTgzMiIsImJhZGdlIjoicmdiYSg2LDI0LDUwLDAuNikiLCJib3JkZXJSYWRpdXMiOjgsImZvcm1Db250cm9sQmciOiJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLCJwcmltYXJ5IjoiIzExYjZhZSIsInNlY29uZGFyeSI6IiMzOTVkZjAiLCJzdWNjZXNzIjoiIzg2YzQwYiIsImVycm9yIjoiI2ZlNWI1YiIsIndhcm5pbmciOiIjZmJiYzA1IiwiaWNvbkNvbG9yIjoiI2ZmZmZmZiIsImZvbnRDb2xvckFjY2VudCI6IiNmZTViNWIiLCJmb250RmFtaWx5IjoiUG9wcGlucyIsInByaW1hcnlCdG5UZXh0IjoiI2ZmZmZmZiIsInNlY29uZGFyeUJ0blRleHQiOiIjZmZmZmZmIn0=","theme":"dark","isHideLogo":true,"logo":""})
                  }}
