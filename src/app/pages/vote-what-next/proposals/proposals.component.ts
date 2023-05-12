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
  // [{
  //   uuid:"234534645",
  //   date: new Date(),
  //   category: "integration",
  //   title: "orca integration",
  //   desc: "This proposal will - Ratify the Constitution to be used by Marinade DAO - Ratify the Code of Conduct to be used by Marinade DAO - Confirm phase one of the migration to SPL governance, where multisigs and team powers are moved to Realms while MNDE voting stays on Tribeca until phase two.",
  //   ownerPK: "JPQmr9p2RF3X5TuBXxn6AGcEfcsHp4ehcmzE5Ys7pZD",
  //   for: 100,
  //   against: 15,
  //   status: "vote",
  // },
  // {
  //   uuid:"678678768",
  //   date: new Date(),
  //   category: "feature",
  //   title: "split accounts  ",
  //   desc: "split stake account loreum ipsum",
  //   ownerPK: "81QNHLve6e9N2fYNoLUnf6tfHWV8Uq4qWZkkuZ8sAfU1",
  //   for: 128,
  //   against: 35,
  //   status: "pass",
  // },
  // {
  //   uuid:"456456",
  //   date: new Date(),
  //   category: "feature",
  //   title: "bulk swap ",
  //   desc: "This proposal will - Ratify the Constitution to be used by Marinade DAO - Ratify the Code of Conduct to be used by Marinade DAO - Confirm phase one of the migration to SPL governance, where multisigs and team powers are moved to Realms while MNDE voting stays on Tribeca until phase two.",
  //   ownerPK: "81QNHLve6e9N2fYNoLUnf6tfHWV8Uq4qWZkkuZ8sAfU1",
  //   for: 8,
  //   against: 3,
  //   status: "completed",
  // }
  // ]
  constructor(private voteService: VotesService) { }

  ngOnInit() { }
  public searchItem(term: any) {
    this.searchTerm = term.value;
  }
}
