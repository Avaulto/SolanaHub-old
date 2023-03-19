import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { BehaviorSubject, combineLatest, firstValueFrom, map, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { FraktStoreService } from '../frakt-store.service';
import { FraktLiquidity, FraktNftItem, FraktNftItemWithLiquidity } from '../frakt.model';

@Component({
  selector: 'app-lend',
  templateUrl: './lend.component.html',
  styleUrls: ['./lend.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
          'max-height': '500px', 'opacity': '1', 'visibility': 'visible'
      })),
      state('out', style({
          'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
      })),
      transition('in => out', [group([
          animate('400ms ease-in-out', style({
              'opacity': '0'
          })),
          animate('600ms ease-in-out', style({
              'max-height': '0px'
          })),
          animate('700ms ease-in-out', style({
              'visibility': 'hidden'
          }))
      ]
      )]),
      transition('out => in', [group([
          animate('1ms ease-in-out', style({
              'visibility': 'visible'
          })),
          animate('600ms ease-in-out', style({
              'max-height': '500px'
          })),
          animate('800ms ease-in-out', style({
              'opacity': '1'
          }))
      ]
      )])
  ])
  ]
})
export class LendComponent implements OnInit {
  // @ViewChildren('icon') icon:QueryList<IonIcon>;
  // sortOrder: 'asc' | 'desc' = 'asc';

  private _fraktNfts$: BehaviorSubject<FraktNftItemWithLiquidity[]> = new BehaviorSubject(null)
  public fraktNfts$ = this._fraktNfts$.asObservable().pipe(shareReplay(1));
  @Input() solBalance: number = 0;
  @Input() wallet;
  @Input() searchTerm: string;
  constructor(private _fraktStore: FraktStoreService) { }

  async ngOnInit() {
    const _fetchNftListed = await firstValueFrom(this._fraktStore.getPoolsListFull());
    this._fraktNfts$.next(_fetchNftListed)
  }

  currentBoxOpen: number = null;
  isOpenBox(ev){
    this.currentBoxOpen = ev.detail.value;
  }

  sortBy(type: string, iconIndex: number) {

    // this.icon.get(iconIndex).name == 'arrow-up-outline' ? this.icon.get(iconIndex).name = 'arrow-down-outline' : this.icon.get(iconIndex).name = 'arrow-up-outline'
    
    // this.sortOrder = this.sortOrder == 'asc' ? 'desc' : 'asc';
    // const sortedData = this._fraktNfts$.value.sort((a, b) => {
    //   if (this.sortOrder == 'asc') {
    //     return a[type] > b[type] ? -1 : 1
    //   } else {
    //     return a[type] < b[type] ? -1 : 1
    //   }
    // });
    // this._fraktNfts$.next(sortedData)

  }
}
