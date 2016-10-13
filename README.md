# Angular 2 Font Picker

<a href="https://badge.fury.io/js/angular2-font-picker"><img src="https://badge.fury.io/js/angular2-font-picker.svg" align="right" alt="npm version" height="18"></a>

This is a simple font picker based on the cool angular2-color-picker by Alberplz.

See a live example application <a href="https://zefoy.github.io/angular2-font-picker/">here</a>.

### Building the library

    npm install
    npm run build

### Running the example

    cd example
    npm install
    npm start

### Installing and usage

    npm install angular2-font-picker --save-dev

##### Load the module for your app (with global configuration):

```javascript
import { FontPickerModule } from 'angular2-font-picker';
import { FontPickerConfigInterface } from 'angular2-font-picker';

const FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Change this to your Google API key
  apiKey: 'AIzaSyA9S7DY0khhn9JYcfyRWb1F6Rd2rwtF_mA'
};

@NgModule({
  ...
  imports: [
    ...
    FontPickerModule.forRoot(FONT_PICKER_CONFIG)
  ]
})
```

##### Use it in your html template (for example in div element):

```html
<div [(fontPicker)]="font" [fpWidth]="'320px'" [fpPosition]="'bottom'">
  Click to open the font picker</div>
```

```javascript
[(fontPicker)]      // Selected font ({family, size, style, styles, files}).

[fpWidth]           // Width of the font picker (Default: '280px').
[fpHeight]          // Height of the font picker (Default: '320px').
[fpPosition]        // Position of the font picker (Default: 'bottom').
[fpSizeSelect]      // Show size selector in the font picker (Default: false).
[fpStyleSelect]     // Show style selector in the font picker (Default: false).
[fpPresetLabel]     // Label for the preset fonts list (Default: undefined).
[fpPresetFonts]     // Listing of preset fonts to show (Default: undefined).
[fpFallbackFont]    // Fallback font (Default: {family: 'Roboto', size: 14}).
[fpCancelButton]    // Show cancel button in the font picker (Default: false).

(fontPickerChange)  // Event handler for the font / size / style change.
```

##### Available configuration options (for the global configuration):

```javascript
apiKey              // Your Google API key for the Google Web Fonts API.
```
