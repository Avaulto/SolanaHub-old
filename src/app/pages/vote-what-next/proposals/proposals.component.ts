import { Component, OnInit } from "@angular/core";
import { Proposal } from "src/app/models";
import { VotesService } from "../votes.service";
import { Observable } from "rxjs";


@Component({
  selector: "app-proposals",
  templateUrl: "./proposals.component.html",
  styleUrls: ["./proposals.component.scss"],
})
export class ProposalsComponent implements OnInit {
  public searchTerm: string;
  public proposals: Observable<Proposal[]> = this.voteService.getProposals()
  constructor(private voteService: VotesService) { }

  ngOnInit() { }
  public searchItem(term: any) {
    this.searchTerm = term.value;
  }
}
