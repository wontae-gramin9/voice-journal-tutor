import { Pipe, PipeTransform } from '@angular/core';
import { convertSecondsToTimeFormat } from '@utils/time';
@Pipe({
  name: 'formatSecond',
})
export class FormatSecondPipe implements PipeTransform {
  transform(totalSeconds: number): string {
    return convertSecondsToTimeFormat(totalSeconds);
  }
}
