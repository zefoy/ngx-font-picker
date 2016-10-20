export interface FontInterface {
  family: string;
  files?: any;
  size: number;
  style: string;
  styles: string[];
}

export interface GoogleFontInterface {
  category: string;
  family: string;
  files: Object[];
  kind: string;
  variants: string[];
}

export interface FontPickerConfigInterface {
  apiKey?: string
}

export class FontPickerConfig implements FontPickerConfigInterface {
  apiKey: string = null;

  constructor(config: FontPickerConfigInterface = {}) {
    this.assign(config);
  }

  public assign(config: FontPickerConfigInterface = {}) {
    for (var key in config) {
      this[key] = config[key];
    }
  }
}

export class Font {
  public family: string;
  public files: any;
  public size: number;
  public style: string;
  public styles: string[];

  constructor(props: FontInterface) {
    this.family = props.family || 'monospace';
    this.styles = props.styles || ['regular'];
    this.files = props.files || null;
    this.style = props.style || 'regular';
    this.size = props.size || 14;
  }

  public getStyles(): any {
    return {
      'font-size': this.size.toString() + 'px',
      'font-family': this.family || 'monospace',
      'font-style': this.style.includes('italic') ? 'italic' : 'normal',
      'font-weight': isNaN(Number(this.style.slice(0, 3))) ? 'normal' : this.style.slice(0, 3)
    }
  }
}

export class GoogleFonts {
  kind: string;
  items: Array<any>;
}
