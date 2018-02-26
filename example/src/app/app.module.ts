import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FONT_PICKER_CONFIG } from 'ngx-font-picker';
import { FontPickerModule, FontPickerConfigInterface } from 'ngx-font-picker';

import { AppComponent } from './app.component';

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Change this to your Google API key
  apiKey: 'AIzaSyA9S7DY0khhn9JYcfyRWb1F6Rd2rwtF_mA'
};

@NgModule({
    bootstrap: [
      AppComponent
    ],
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      FlexLayoutModule,
      ReactiveFormsModule,
      FontPickerModule
    ],
    exports: [
    ],
    providers: [
      {
        provide: FONT_PICKER_CONFIG,
        useValue: DEFAULT_FONT_PICKER_CONFIG
      }
    ]
})
export class AppModule {}
