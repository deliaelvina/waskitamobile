import { Pipe, PipeTransform } from '@angular/core';
import { Unit } from './unit';


@Pipe({
    name: 'unitfilter'
})
export class UnitFilterPipe implements PipeTransform {
  transform(items: Unit[], filter: string) {
    //  let tt : Unit[];
     var tt = [];
    if (!items || !filter) {
      return items;
    }
    // filter items array, items which match and return true will be kept, false will be filtered out
    return items.filter((item: Unit) => this.applyFilter(item, filter));
    //  items.filter((item: Unit) => this.applyFilter(item, filter));

    //  items.forEach(val=>{
    //     tt.push({
    //         lot: val.lot,
    //         descs: val.descs,
    //         bed : val.bed,
    //         bd : val.bd,
    //         bath : val.bath,
    //         bh : val.bh,
    //         status : val.status,
    //         studios : val.studios,
    //         style : val.style,
    //         level_no:val.level_no,
    //         lengthCol: items.length
    //       });
    //  });

    //  items = tt;
    //  return items;
  }
  
  /**
   * Perform the filtering.
   * 
   * @param {Unit} book The Unit to compare to the filter.
   * @param {Unit} filter The filter to apply.
   * @return {boolean} True if book satisfies filters, false if not.
   */
  applyFilter(book: Unit, filter: string): boolean {
    // for (let field in filter) {
    //   if (filter[field]) {
        // if (typeof filter[field] === 'string') {
          if (book['level_no'].toLowerCase().indexOf(filter.toLowerCase()) === -1) {
            return false;
          }
        // } 
        // else if (typeof filter[field] === 'number') {
        //   if (book[field] !== filter[field]) {
        //     return false;
        //   }
        // }
    //   }
    // }
    return true;
  }
}