import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FraktStoreService } from '../../frakt-store.service';
import { FraktNftMetadata } from '../../frakt.model';

@Component({
  selector: 'app-box-content',
  templateUrl: './box-content.component.html',
  styleUrls: ['./box-content.component.scss'],
})
export class BoxContentComponent implements OnInit, OnChanges {
  @Input() collectionName: string;
  @Input() accordionOpen: boolean;
  public NftMetadata: FraktNftMetadata[] = null
  constructor(private _fraktStore: FraktStoreService) { }
  ngOnChanges(changes): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(this.accordionOpen){
      this.getNftMetadata(this.collectionName)
    }
  }
  ngOnInit() {}
  async getNftMetadata(collectionName: string){
    const metadata = await this._fraktStore.fetchPoolMetadata(collectionName);
    this.NftMetadata = metadata
  }

  
}
