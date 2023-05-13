import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, firstValueFrom, lastValueFrom, of, takeLast } from 'rxjs';
import { SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';
import { VotesService } from '../votes.service';
import { newProposal } from 'src/app/models';
import { WalletStore } from '@heavy-duty/wallet-adapter';

@Component({
  selector: 'app-new-proposal',
  templateUrl: './new-proposal.component.html',
  styleUrls: ['./new-proposal.component.scss'],
})
export class NewProposalComponent implements OnInit {
  @Input() categories: Observable<{ name: string, value: string }[]> = of([
    { name: 'feature request', value: 'feature request', selectable: true, },
    { name: 'integration request', value: 'integration request', selectable: true, }
  ])
  @Input() wallet;
  public proposalForm: FormGroup;
  formSubmitted: boolean = false;
  public showCategoryList: boolean = false;
  constructor(
    private _fb: FormBuilder,
    private _votesService: VotesService,
    private _solanaUtilsService:SolanaUtilsService,
    private _walletStore: WalletStore
  ) { }

  ngOnInit() {
    this.proposalForm = this._fb.group({
      category: ['', [Validators.required]],
      title: ['', [Validators.required]],
      desc: ['', [Validators.required]]
    })
  }
  setSelectedCategory(category: string) {
    this.proposalForm.controls['category'].setValue(category)
    this.showCategoryList = !this.showCategoryList
  }
  async submitProposal() {
    const { category, title, desc } = this.proposalForm.value
    const walletPubkey = this._solanaUtilsService.getCurrentWallet().publicKey.toBase58();
    const message = (new TextEncoder()).encode(title) as Buffer;
    const signeture = await firstValueFrom(this._walletStore.signMessage(message));
 
    const proposal: newProposal = { category, title, desc, proposalOwnerPk: walletPubkey, signeture }
    this._votesService.newProposal(proposal).subscribe(res =>{
      this._votesService.emitGetProposals.next(true);
    })
    console.log(this.proposalForm.value)
  }

}
