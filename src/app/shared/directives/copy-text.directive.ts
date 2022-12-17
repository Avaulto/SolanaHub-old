import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import copy from 'copy-to-clipboard';
@Directive({
  selector: '[appCopyText]'
})
export class CopyTextDirective {
    @Input() copyText: string;
    @HostListener('click') copyToClipboard(){
        copy(this.copyText);
    }
}