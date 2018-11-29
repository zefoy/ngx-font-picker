import { Component } from '@angular/core';

import { Font } from 'ngx-font-picker';

@Component({
  selector: 'my-app',
  moduleId: 'src/app/app.component',
  templateUrl: 'app.component.html',
  styleUrls: [ 'app.component.css' ]
})
export class AppComponent {
  private _presetFonts = ['Arial', 'Times', 'Courier', 'Lato', 'Open Sans', 'Roboto Slab'];

  public font: Font = new Font({
    family: 'Roboto',
    size: '14px',
    style: 'regular',
    styles: ['regular']
  });

  public sizeSelect: boolean = true;
  public styleSelect: boolean = true;

  public presetFonts = this._presetFonts;

  constructor() {}

  public togglePresetFonts(): void {
    this.presetFonts = this.presetFonts.length ? [] : this._presetFonts;
  }

  public toggleExtraOptions(): void {
    this.sizeSelect = !this.sizeSelect;
    this.styleSelect = !this.styleSelect;
  }
}
