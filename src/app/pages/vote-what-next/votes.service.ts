import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, combineLatestWith, map, throwError } from 'rxjs';
import { Proposal, newProposal, toastData, voter } from 'src/app/models';
import { ApiService, ToasterService,  UtilsService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class VotesService {
  protected votesProxy = this._utilsService.serverlessAPI;
  constructor(

    private _toasterService: ToasterService,
    private apiService: ApiService,
    private _utilsService:UtilsService,
  ) { }
  public emitGetProposals = new BehaviorSubject(true as boolean)

  private _formatErrors(error: any) {
    console.warn(error)
    this._toasterService.msg.next({
      message: error.message,
      // icon: 'alert-circle-outline',
      segmentClass: "toastError",
    });
    return throwError((() => error))
  }
  public newProposal(proposal: newProposal): Observable<Proposal> {
    return this.apiService.post(`${this.votesProxy}/api/votes/newProposal`, {proposal}).pipe(
      map(res =>{
        const toasterMessage: toastData = {
          message: res.message,
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

  public addVote(proposalId: string, voter: voter): Observable<boolean> {
    return this.apiService.post(`http://localhost:8000/addVote`, {proposalId, voter}).pipe(
      map(res =>{
        const toasterMessage: toastData = {
          message: res.message,
          segmentClass: "toastInfo"
        }
        this._toasterService.msg.next(toasterMessage)
        return res
      }),
      catchError((error) => this._formatErrors(error))
    );
  }
}
