import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { PipesModule } from "./pipes-module";

import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FontPickerComponent } from "./font-picker.component";

@NgModule({
    imports: [BrowserModule, PerfectScrollbarModule, FormsModule, ReactiveFormsModule, PipesModule],
    declarations: [FontPickerComponent],
    exports: [FormsModule, ReactiveFormsModule]
})
export class DynamicFpModule { };
