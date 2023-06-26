import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: false
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args: any ): any {
    if (!value || !args) {
      return value;
    }
    let result = value.filter(item => {
      let fullName = `${item.firstName} ${item.lastName}`;

      return fullName.toLowerCase().includes(args.toLowerCase());
    })
    return result;
  }

}
