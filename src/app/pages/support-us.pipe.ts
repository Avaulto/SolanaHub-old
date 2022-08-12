import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'supportUs'
})
export class SupportUsPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
