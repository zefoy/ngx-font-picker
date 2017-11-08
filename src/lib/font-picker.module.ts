import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { FontPickerService } from './font-picker.service';
import { FontPickerComponent } from './font-picker.component';
import { FontPickerDirective } from './font-picker.directive';

import { FontSizePipe, FontStylesPipe, StatefulSlicePipe } from './font-picker.pipes';

@NgModule({
  entryComponents: [ FontPickerComponent ],
  declarations: [ FontPickerComponent, FontPickerDirective, FontSizePipe, FontStylesPipe, StatefulSlicePipe ],
  imports: [ CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, PerfectScrollbarModule ],
  exports: [ FormsModule, ReactiveFormsModule, FontPickerDirective, FontSizePipe, FontStylesPipe, StatefulSlicePipe ],
  providers: [ FontPickerService ]
})
export class FontPickerModule {
}
