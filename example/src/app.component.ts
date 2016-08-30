import { Component, ViewEncapsulation } from '@angular/core';

import { Font } from 'angular2-font-picker';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  private title = 'Simple example app for the angular2-font-picker';

  private _presetFonts = ['arial', 'serif', 'helvetica', 'sans-serif', 'open sans', 'roboto slab'];

  private presetFonts = this._presetFonts;

  private font: Font = new Font({
    family: 'Roboto',
    styles: ['regular'],
    style: 'regular',
    size: 14
  });

  constructor() {}

  togglePresetFonts() {
    this.presetFonts = this.presetFonts.length > 0 ? [] : this._presetFonts;
  }
}
