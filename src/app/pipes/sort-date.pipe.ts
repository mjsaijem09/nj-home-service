import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sort"
})
export class ArraySortPipe  implements PipeTransform {
  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    if (field === 'date') {
        array.sort(function(a,b) {
            var dateA = new Date(a.createdAt.split('T')[0]), dateB = new Date(b.createdAt.split('T')[0])
            return dateA.getDate() - dateB.getDate();
        });
        return array;
    }
  }
}