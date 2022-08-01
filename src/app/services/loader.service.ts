import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading = new Subject<boolean>();
  public show(): void {
    this.isLoading.next(true);
  }
  hide(): void {
    this.isLoading.next(false);
  }

}
