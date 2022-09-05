import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-placeholder',
  templateUrl: './image-placeholder.component.html',
  styleUrls: ['./image-placeholder.component.scss'],
})
export class ImagePlaceholderComponent implements OnInit {
  @Input() imagePath: string;
  public hideSkelaton: boolean;
  constructor() { }

  ngOnInit() {}

}
