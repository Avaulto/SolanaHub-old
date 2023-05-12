import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Proposal } from 'src/app/models';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService,
    private apiService: ApiService,
  ) { }


  private _formatErrors(error: any) {
    console.warn(error)
    this._toasterService.msg.next({
      message: error.error,
      // icon: 'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError((() => error))
  }
  public newProposal(proposal: Proposal): Observable<Proposal> {
    return this.apiService.post('/api/votes/newProposal', proposal).pipe(
      catchError((error) => this._formatErrors(error))
    );
  }
  public getProposals(): Observable<Proposal[]> {
    return this.apiService.get('/api/votes/getProposals').pipe(
      catchError((error) => this._formatErrors(error))
    );
  }

  public addVote(propId: string, vote: "for" | "against"): Observable<boolean> {
    return this.apiService.post('/api/votes/addVote', {propId, vote}).pipe(
      catchError((error) => this._formatErrors(error))
    );
  }
}
