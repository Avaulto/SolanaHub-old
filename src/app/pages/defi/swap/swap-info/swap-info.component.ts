import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SwapDetail } from 'src/app/shared/models/swapDetails.model';


@Component({
  selector: 'app-swap-info',
  templateUrl: './swap-info.component.html',
  styleUrls: ['./swap-info.component.scss'],
})
export class SwapInfoComponent implements OnInit {
  @Input() swapDetail: SwapDetail;
  constructor() { }

  ngOnInit() {}

}
