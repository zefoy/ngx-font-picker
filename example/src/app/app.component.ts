import { Component } from '@angular/core';

import { Font } from 'ngx-font-picker';

@Component({
  selector: 'my-app',
  moduleId: 'src/app/app.component',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  private _presetFonts = ['Arial', 'Serif', 'Helvetica', 'Sans-Serif', 'Open Sans', 'Roboto Slab'];

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

  togglePresetFonts() {
    this.presetFonts = this.presetFonts.length ? [] : this._presetFonts;
  }

  toggleExtraOptions() {
    this.sizeSelect = !this.sizeSelect;
    this.styleSelect = !this.styleSelect;
  }
}
