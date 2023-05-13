import { Component, Input, OnInit } from '@angular/core';
import { Proposal, voter } from 'src/app/models';
import { VotesService } from '../../votes.service';
import { firstValueFrom } from 'rxjs';
import { WalletStore } from '@heavy-duty/wallet-adapter';
import { SolanaUtilsService } from 'src/app/services';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() proposal: Proposal;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _votesService: VotesService,
    private _walletStore: WalletStore) { }

  ngOnInit() { }

  public async addVote(proposalId: string, voted: "for" | "against") {
    const voterPubkey = this._solanaUtilsService.getCurrentWallet().publicKey.toBase58();
    const message = (new TextEncoder()).encode(voted) as Buffer;
    const signeture = await firstValueFrom(this._walletStore.signMessage(message));
    const voter: voter = { voterPubkey, signeture, voted }

    this._votesService.addVote(proposalId, voter).subscribe(() =>{
      this._votesService.emitGetProposals.next(true);
    })
  }
}
