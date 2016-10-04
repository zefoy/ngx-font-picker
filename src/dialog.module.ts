import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'angular2-perfect-scrollbar';

import { PipesModule } from "./pipes.module";

import { DialogComponent } from "./dialog.component";

@NgModule({
    imports: [BrowserModule, PerfectScrollbarModule, FormsModule, ReactiveFormsModule, PipesModule],
    declarations: [DialogComponent],
    exports: [FormsModule, ReactiveFormsModule]
})
export class DialogModule {}
