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
      'font-weight': this.style.includes('regular') || isNaN(Number(this.style.slice(0,3))) ? 'normal' : this.style.slice(0,3),
      'font-style': this.style.includes('i') || this.style.includes('italic') ? 'italic' : 'normal'
    }
  }
}

export class GoogleFonts {
  kind: string;
  items: Array<any>;
}
