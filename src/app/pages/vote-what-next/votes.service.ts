import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, combineLatestWith, map, throwError } from 'rxjs';
import { Proposal, newProposal, toastData, voteSinger } from 'src/app/models';
import { ApiService, SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VotesService {
  protected votesProxy = environment.serverlessAPI;
  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService,
    private apiService: ApiService,
  ) { }
  public emitGetProposals = new BehaviorSubject(true as boolean)

  private _formatErrors(error: any) {
    console.warn(error)
    this._toasterService.msg.next({
      message: error.error,
      // icon: 'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError((() => error))
  }
  public newProposal(proposal: newProposal): Observable<Proposal> {
    return this.apiService.post(`${this.votesProxy}/api/votes/newProposal`, {proposal}).pipe(
      map(res =>{
        const toasterMessage: toastData = {
          message: 'new proposal added',
          segmentClass: "toastInfo"
        }
        this._toasterService.msg.next(toasterMessage)
        return res
      }),
      catchError((error) => this._formatErrors(error))
    );
  }
  public getProposals(): Observable<Proposal[]> {
    return this.apiService.get(`${this.votesProxy}/api/votes/getProposals`).pipe(
      catchError((error) => this._formatErrors(error))
    );
  }

  public addVote(propId: string, voteSinger: voteSinger): Observable<boolean> {
    return this.apiService.post(`${this.votesProxy}/api/votes/addVote`, {propId, voteSinger}).pipe(
      map(res =>{
        const toasterMessage: toastData = {
          message: 'vote added',
          segmentClass: "toastInfo"
        }
        this._toasterService.msg.next(toasterMessage)
        return res
      }),
      catchError((error) => this._formatErrors(error))
    );
  }
}
