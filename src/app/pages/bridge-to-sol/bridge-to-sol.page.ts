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

  ngOnInit() {
    //@ts-ignore
    deBridge.widget({"v":"1","element":"debridgeWidget","title":"ETH to LST","description":"swap your ETH to a liquid stake SOL and earn 7.5% APY just by holding it","width":"600","height":"1000","r":null,"supportedChains":"{\"inputChains\":{\"1\":\"all\"},\"outputChains\":{\"7565164\":[\"mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So\",\"bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1\"]}}","inputChain":1,"outputChain":7565164,"inputCurrency":"","outputCurrency":"","address":"","showSwapTransfer":true,"amount":"","outputAmount":"","isAmountFromNotModifiable":false,"isAmountToNotModifiable":false,"lang":"en","mode":"deswap","isEnableCalldata":false,"styles":"eyJhcHBCYWNrZ3JvdW5kIjoicmdiYSg2LDI0LDUwLDAuNikiLCJhcHBBY2NlbnRCZyI6InJnYmEoMCwwLDAsMCkiLCJjaGFydEJnIjoicmdiYSgxMzUsMTEwLDExMCwwKSIsImJhZGdlIjoicmdiYSgxNzQsMTksMTksMCkiLCJib3JkZXJSYWRpdXMiOjgsInByaW1hcnkiOiIjMTFiNmFlIiwic2Vjb25kYXJ5IjoiIzM5NWRmMCIsInN1Y2Nlc3MiOiIjODZjNDBiIiwiZXJyb3IiOiIjZmU1YjViIiwid2FybmluZyI6IiNmYmJjMDUiLCJpY29uQ29sb3IiOiIjZmZmZmZmIiwiZm9udENvbG9yQWNjZW50IjoiI2ZlNWI1YiIsImZvbnRGYW1pbHkiOiJQb3BwaW5zIiwicHJpbWFyeUJ0blRleHQiOiIjZmZmZmZmIiwic2Vjb25kYXJ5QnRuVGV4dCI6IiNmZmZmZmYifQ==","theme":"dark","isHideLogo":false,"logo":""})
    }}
