import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'FontSize',
  pure: true
})
export class FontSizePipe implements PipeTransform {
  transform(value: string): number {
    return value ? parseInt(value.replace(/[^-\d\.]/g, '') || '16', 10) : 0;
  }
}

@Pipe({
  name: 'FontStyles',
  pure: true
})
export class FontStylesPipe implements PipeTransform {
  transform(value: string): string {
    const lookup = {
      '100': 'Thin',
      '200': 'Extra-Light',
      '300': 'Light',
      '400': 'Regular',
      '500': 'Medium',
      '600': 'Semi-bold',
      '700': 'Bold',
      '800': 'Extra-bold',
      '900': 'Black'
    };

    for (const style in lookup) {
      const found = value && value.search(style);

      if (found >= 0 && value != null) {
        value = value.replace(style, lookup[style] + ' ');

        break;
      }
    }

    return value;
  }
}

@Pipe({
  name: 'StatefulSlice',
  pure: false
})
export class StatefulSlicePipe implements PipeTransform {
  private slicedArray: any[] = [];
  private previousArrayRef: any[] = [];
  private previousEndValue: number = 0;

  transform(arr: any[], start: number, end: number): any[] {
    if (arr && (this.previousEndValue !== end || this.previousArrayRef !== arr)) {
      this.slicedArray = arr.slice(start, end);

      this.previousArrayRef = arr;
      this.previousEndValue = end;
    }

    return this.slicedArray || arr;
  }
}
