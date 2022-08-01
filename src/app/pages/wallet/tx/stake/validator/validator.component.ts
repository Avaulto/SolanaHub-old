import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ValidatorData } from 'src/app/shared/models/validatorData.model';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidatorComponent implements OnInit {
  @Input() validatorData: ValidatorData;
  @Input() searchTerm: string = '';
  @Input() showValidatorList: boolean = false;
  @Input() showDropDownIcon: boolean = false;
  @Output() setSelectedValidator = new EventEmitter();
  constructor() { }

  ngOnInit() {}
}
