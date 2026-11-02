import { Pipe, PipeTransform } from '@angular/core';
import { Suggestions } from '../../features/timeline/components/side-right/models/suggestions.interface';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(arr: Suggestions[], text:string): Suggestions[] {


    return arr.filter((friend) => friend.name.toLowerCase().includes(text.toLowerCase()));
  }
}
