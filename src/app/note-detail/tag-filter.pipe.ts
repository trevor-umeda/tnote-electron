import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tagfilter',
    pure: false
})
export class TagFilterPipe implements PipeTransform {
    transform(notes: any[], filter: Object): any {
        if (!notes || !filter) {
            return notes;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return notes.filter(note => note.tag == filter);
    }
}
