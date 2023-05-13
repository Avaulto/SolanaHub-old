import { Component, OnInit } from "@angular/core";
import { Proposal, WalletExtended } from "src/app/models";
import { VotesService } from "../votes.service";
import { Observable, switchMap } from "rxjs";
import { SolanaUtilsService } from "src/app/services";


@Component({
  selector: "app-proposals",
  templateUrl: "./proposals.component.html",
  styleUrls: ["./proposals.component.scss"],
})
export class ProposalsComponent implements OnInit {
  public searchTerm: string = "";
  // retrigger fetch proposals
  public proposals: Observable<Proposal[]> = this._voteService.emitGetProposals.pipe(switchMap(() => this._voteService.getProposals()))
  constructor(private _voteService: VotesService, private _solanaUtilsService:SolanaUtilsService) { }

  ngOnInit() { 
  }
  public searchItem(term: any) {
    this.searchTerm = term.value;
  }
  
}
