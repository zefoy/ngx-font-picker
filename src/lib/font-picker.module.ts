import { NgModule, ModuleWithProviders, OpaqueToken, Optional, SkipSelf, Inject } from '@angular/core';

import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { FontPickerService } from './font-picker.service';
import { FontPickerComponent } from './font-picker.component';
import { FontPickerDirective } from './font-picker.directive';

import { FontPickerConfig, FontPickerConfigInterface} from './interfaces';
import { FontSizePipe, FontStylesPipe, StatefulSlicePipe } from './pipes';

export const FONT_PICKER_GUARD = new OpaqueToken('FONT_PICKER_GUARD');
export const FONT_PICKER_CONFIG = new OpaqueToken('FONT_PICKER_CONFIG');

@NgModule({
  declarations: [ FontPickerComponent, FontPickerDirective, FontSizePipe, FontStylesPipe, StatefulSlicePipe ],
  imports: [ CommonModule, HttpModule, FormsModule, ReactiveFormsModule, PerfectScrollbarModule ],
  exports: [ FormsModule, ReactiveFormsModule, FontPickerDirective, FontSizePipe, FontStylesPipe, StatefulSlicePipe ],
  entryComponents: [ FontPickerComponent ]
})
export class FontPickerModule {
  constructor (@Optional() @Inject(FONT_PICKER_GUARD) guard: any) {}

  static forRoot(config?: FontPickerConfigInterface): ModuleWithProviders {
    return {
      ngModule: FontPickerModule,
      providers: [
        FontPickerService,
        {
          provide: FONT_PICKER_GUARD,
          useFactory: provideForRootGuard,
          deps: [
            [
              FontPickerConfig,
              new Optional(),
              new SkipSelf()
            ]
          ]
        },
        {
          provide: FONT_PICKER_CONFIG,
          useValue: config ? config : {}
        },
        {
          provide: FontPickerConfig,
          useFactory: provideDefaultConfig,
          deps: [
            FONT_PICKER_CONFIG
          ]
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: FontPickerModule
    };
  }
}

export function provideForRootGuard(config: FontPickerConfig): any {
  if (config) {
    throw new Error(`
      Application called FontPickerModule.forRoot() twice.
      For submodules use FontPickerModule.forChild() instead.
    `);
  }

  return 'guarded';
}

export function provideDefaultConfig(config: FontPickerConfigInterface): FontPickerConfig {
  return new FontPickerConfig(config);
}
