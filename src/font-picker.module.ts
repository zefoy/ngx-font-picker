import { NgModule, ModuleWithProviders, OpaqueToken, Optional, SkipSelf } from '@angular/core';

import { HttpModule } from "@angular/http";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

import { FontPickerService } from './font-picker.service';
import { FontPickerComponent } from './font-picker.component';
import { FontPickerDirective } from './font-picker.directive';

import { FontStylesPipe, StatefulSlicePipe } from './pipes';
import { FontPickerConfig, FontPickerConfigInterface} from './interfaces';

export const FONT_PICKER_CONFIG = new OpaqueToken('FONT_PICKER_CONFIG');

@NgModule({
    imports: [CommonModule, HttpModule, FormsModule, ReactiveFormsModule, PerfectScrollbarModule],
    declarations: [FontPickerComponent, FontPickerDirective, FontStylesPipe, StatefulSlicePipe],
    exports: [CommonModule, HttpModule, FormsModule, ReactiveFormsModule, FontPickerDirective, FontStylesPipe, StatefulSlicePipe ],
    entryComponents: [ FontPickerComponent ]
})
export class FontPickerModule {
  constructor (@Optional() @SkipSelf() parentModule: FontPickerModule) {
    if (parentModule) {
      throw new Error(`FontPickerModule is already loaded.
        Import it in the AppModule only!`);
    }
  }

  static forRoot(config: FontPickerConfigInterface): ModuleWithProviders {
    return {
      ngModule: FontPickerModule,
      providers: [
				FontPickerService,
				{
					provide: FONT_PICKER_CONFIG,
					useValue: config ? config : {}
				},
				{
					provide: FontPickerConfig,
			    useFactory: provideFontPickerConfig,
					deps: [
						FONT_PICKER_CONFIG
					]
				}
			]
    };
  }
}

export function provideFontPickerConfig(configInterface: FontPickerConfigInterface = {}) {
	const config = new FontPickerConfig();

	config.apiKey = configInterface.apiKey || '';

  return config;
}
