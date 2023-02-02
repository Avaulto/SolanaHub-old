import { Component, OnInit } from '@angular/core';
import { OrcaStoreService } from '../orca-store.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {

  constructor(private _orcaStoreService:OrcaStoreService) { }

  async ngOnInit() {
    console.log('port loaded')
    const ata = await this._orcaStoreService.getATA()
    const res = await this._orcaStoreService.fetchOpenPositions(ata)
    res.subscribe(res =>{
      console.log(res);
    })
  }

}
