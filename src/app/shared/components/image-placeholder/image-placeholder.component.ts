import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-placeholder',
  templateUrl: './image-placeholder.component.html',
  styleUrls: ['./image-placeholder.component.scss'],
})
export class ImagePlaceholderComponent implements OnChanges {
  @Input() imagePath: string;
  public showSkelaton: boolean = true;
  constructor() { }

  ngOnChanges(): void {
  }
  
}
