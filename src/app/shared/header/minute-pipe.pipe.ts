import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutePipe'
})
export class MinutePipePipe implements PipeTransform {

  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (minutes == 0 ? '00' : minutes) + ':' + ((value - minutes * 60) > 9 ? Math.trunc(value - minutes * 60) : "0" + Math.trunc(value - minutes * 60));
 }

}
