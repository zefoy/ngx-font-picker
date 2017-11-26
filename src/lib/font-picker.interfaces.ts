import { InjectionToken } from '@angular/core';

export const FONT_PICKER_CONFIG = new InjectionToken('FONT_PICKER_CONFIG');

export interface FontInterface {
  size: string;
  style: string;
  family: string;

  files?: any;
  styles?: string[];
}

export interface GoogleFontInterface {
  kind: string;
  family: string;
  category: string;

  files: any[];
  variants: string[];
}

export class GoogleFontsInterface {
  kind: string;
  items: any[];
}

export class Font implements FontInterface {
  public size: string = null;
  public style: string = 'regular';
  public family: string = 'monospace';

  public files: any = null;
  public styles: string[]= ['regular'];

  constructor(props?: FontInterface) {
    if (props) {
      this.size = props.size || null;
      this.style = props.style || 'regular';
      this.family = props.family || 'monospace';

      this.files = props.files || null;
      this.styles = props.styles || ['regular'];
    }
  }

  public getStyles(): any {
    return {
      'font-size': this.size || '16px',
      'font-style': this.style.includes('italic') ?
        'italic' : 'normal',
      'font-family': this.family || 'monospace',
      'font-weight': isNaN(Number(this.style.slice(0, 3))) ?
        'normal' : this.style.slice(0, 3)
    };
  }
}

export interface FontPickerConfigInterface {
  apiKey?: string;
}

export class FontPickerConfig implements FontPickerConfigInterface {
  apiKey: string = null;

  constructor(config: FontPickerConfigInterface = {}) {
    this.assign(config);
  }

  public assign(config: FontPickerConfigInterface = {}) {
    for (const key in config) {
      this[key] = config[key];
    }
  }
}
