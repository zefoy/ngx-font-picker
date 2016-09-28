import { NgModule, Compiler, ReflectiveInjector } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

import { StatefulSlicePipe } from './pipes';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {FontPickerComponent} from "./font-picker.component";

@NgModule({
    imports: [BrowserModule, PerfectScrollbarModule, FormsModule, ReactiveFormsModule],
    declarations: [FontPickerComponent, StatefulSlicePipe],
    exports: [StatefulSlicePipe, FormsModule, ReactiveFormsModule]
})
export class DynamicFpModule { };
