import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontPickerModule, FontPickerConfigInterface } from 'angular2-font-picker';
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

import { AppComponent } from './app.component';

const FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  apiKey: '' // INSERT YOUR GOOGLE API KEY HERE
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
      ReactiveFormsModule,
      FontPickerModule.forRoot(FONT_PICKER_CONFIG)
    ]
})
export class AppModule {}
