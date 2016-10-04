import { Component, ViewEncapsulation } from '@angular/core';

import { Font } from 'angular2-font-picker';

@Component({
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  private _presetFonts = ['Arial', 'Serif', 'Helvetica', 'Sans-Serif', 'Open Sans', 'Roboto Slab'];

  private title = 'Simple example app for the angular2-font-picker';

  private font: Font = new Font({
    family: 'Roboto',
    styles: ['regular'],
    style: 'regular',
    size: 14
  });

	private sizeSelect: boolean = true;
	private styleSelect: boolean = true;

  private presetFonts = this._presetFonts;

  constructor() {}

  togglePresetFonts() {
    this.presetFonts = this.presetFonts.length ? [] : this._presetFonts;
  }

	toggleExtraOptions() {
		this.sizeSelect = !this.sizeSelect;
		this.styleSelect = !this.styleSelect;
	}
}
