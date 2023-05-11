import { Injectable } from '@angular/core';
import { SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class VotesService {

  constructor(
    private _solanaUtilsService: SolanaUtilsService,
    private _txInterceptService: TxInterceptService,
    private _toasterService: ToasterService,
  ) { }
}
