import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';

import { SharedModule } from "./shared.module";

import { DialogComponent } from "./dialog.component";

@NgModule({
  imports: [BrowserModule, PerfectScrollbarModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [DialogComponent],
  exports: [FormsModule, ReactiveFormsModule],
  entryComponents: [DialogComponent]
})
export class DialogModule {}
