import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {
  transform(values: any[], key: string, searchTerm?: string): any {
    return values.filter((value) => {
      return value[key].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }
}
