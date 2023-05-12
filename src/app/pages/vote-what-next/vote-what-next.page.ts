import { Component, OnInit } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Proposal } from 'src/app/models';
import { ApiService, ToasterService } from 'src/app/services';

@Component({
  selector: 'app-vote-what-next',
  templateUrl: './vote-what-next.page.html',
  styleUrls: ['./vote-what-next.page.scss'],
})
export class VoteWhatNextPage implements OnInit {

  ngOnInit() {
  }

}
