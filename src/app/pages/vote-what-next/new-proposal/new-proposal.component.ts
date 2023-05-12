import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { SolanaUtilsService, ToasterService, TxInterceptService } from 'src/app/services';
import { VotesService } from '../votes.service';

@Component({
  selector: 'app-new-proposal',
  templateUrl: './new-proposal.component.html',
  styleUrls: ['./new-proposal.component.scss'],
})
export class NewProposalComponent  implements OnInit {
  @Input() categories: Observable<{name: string, value:string}[]> = of([
    {  name: 'feature request', value: 'feature request',  selectable: true, },
    {  name: 'integration request', value: 'integration request',  selectable: true, }
    ])
  @Input() wallet;
  public proposalForm: FormGroup;
  formSubmitted: boolean = false;
  public showCategoryList: boolean = false;
  constructor(    
    private _fb: FormBuilder,
    private votesService:VotesService
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
  submitProposal(){
    console.log(this.proposalForm.value)
  }
  public isFocus = false
  isDescFocus(ev){
    console.log(ev)
    this.isFocus = ev.returnValue;
    console.log(this.isFocus)
  }
}
