import { bootstrapApplication } from '@angular/platform-browser'
import { provideHttpClient } from '@angular/common/http'

import { FONT_PICKER_CONFIG, FontPickerConfigInterface } from 'ngx-font-picker'

import { AppComponent } from './app/app.component'

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Change this to your Google API key
  apiKey: 'AIzaSyA9S7DY0khhn9JYcfyRWb1F6Rd2rwtF_mA'
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG
    }
  ]
})
