import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';

import { SharedModule } from "./shared.module";

import { DialogComponent } from "./dialog.component";

@NgModule({
  imports: [CommonModule, PerfectScrollbarModule, FormsModule, ReactiveFormsModule, SharedModule],
  declarations: [DialogComponent],
  exports: [FormsModule, ReactiveFormsModule],
  entryComponents: [DialogComponent]
})
export class DialogModule {}
