import { Component, OnInit } from "@angular/core";
import { Proposal } from "src/app/models";
import { VotesService } from "../votes.service";
import { Observable, switchMap } from "rxjs";


@Component({
  selector: "app-proposals",
  templateUrl: "./proposals.component.html",
  styleUrls: ["./proposals.component.scss"],
})
export class ProposalsComponent implements OnInit {
  public searchTerm: string;
  public proposals: Observable<Proposal[]> = this._voteService.emitGetProposals.pipe(switchMap((res: boolean) => {
    if(res){
      return this._voteService.getProposals()
    }
  }))
  constructor(private _voteService: VotesService) { }

  ngOnInit() { }
  public searchItem(term: any) {
    this.searchTerm = term.value;
  }
}
