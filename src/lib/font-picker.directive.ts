import * as WebFont from 'webfontloader';

import { Directive, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ElementRef, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';

import { Font } from './interfaces';

import { FontPickerComponent } from './font-picker.component';

@Directive({
  selector: '[fontPicker]'
})
export class FontPickerDirective implements OnInit {
  private dialog: any;

  @Input('fontPicker') fontPicker: Font;

  @Input('fpWidth') fpWidth: string = '280px';
  @Input('fpHeight') fpHeight: string = '320px';

  @Input('fpFallbackFont') fpFallbackFont: Font = new Font({
    family: 'Roboto',
    size: '16px',
    style: 'regular',
    styles: ['regular']
  });

  @Input('fpPresetLabel') fpPresetLabel: string;
  @Input('fpPresetFonts') fpPresetFonts: Array<string>;

  @Input('fpSizeSelect') fpSizeSelect: boolean = true;
  @Input('fpStyleSelect') fpStyleSelect: boolean = true;

  @Input('fpPosition') fpPosition: string = 'bottom';
  @Input('fpPositionOffset') fpPositionOffset: string = '0%';
  @Input('fpPositionRelativeToArrow') fpPositionRelativeToArrow: boolean = false;

  @Input('fpCancelButton') fpCancelButton: boolean = false;
  @Input('fpCancelButtonText') fpCancelButtonText: string = 'Cancel';
  @Input('fpCancelButtonClass') fpCancelButtonClass: string = 'fp-cancel-button-class';

  @Input('fpUploadButton') fpUploadButton: boolean = false;
  @Input('fpUploadButtonText') fpUploadButtonText: string = 'Upload';
  @Input('fpUploadButtonClass') fpUploadButtonClass: string = 'fp-upload-button-class';

  @Output('fontPickerChange') fontPickerChange = new EventEmitter<Font>();

  @HostListener('click', ['$event']) onClick(event: Event) {
    if (!this.dialog) {
      const compFactory = this.resolver.resolveComponentFactory(FontPickerComponent);
      const injector = ReflectiveInjector.fromResolvedProviders([], this.vc.parentInjector);

      this.dialog = this.vc.createComponent(compFactory, 0, injector, []).instance;

      this.dialog.setDialog(this, this.el, this.fontPicker, this.fpPosition, this.fpPositionOffset,
        this.fpPositionRelativeToArrow, this.fpPresetLabel, this.fpPresetFonts, this.fpUploadButton,
        this.fpUploadButtonClass, this.fpUploadButtonText, this.fpStyleSelect, this.fpSizeSelect,
        this.fpCancelButton, this.fpCancelButtonClass, this.fpCancelButtonText, this.fpHeight, this.fpWidth);
    } else if (!this.dialog.open) {
      this.dialog.updateDialog(this.fontPicker, this.fpPosition, this.fpPositionOffset,
        this.fpPositionRelativeToArrow, this.fpPresetLabel, this.fpPresetFonts, this.fpUploadButton,
        this.fpUploadButtonClass, this.fpUploadButtonText, this.fpStyleSelect, this.fpSizeSelect,
        this.fpCancelButton, this.fpCancelButtonClass, this.fpCancelButtonText, this.fpHeight, this.fpWidth);

      this.dialog.openFontPicker();
    } else {
      this.dialog.closeFontPicker();
    }
  }

  constructor(private resolver: ComponentFactoryResolver, private el: ElementRef, private vc: ViewContainerRef) {}

  ngOnInit() {
    const fontPicker = this.fontPicker;

    if (!this.fontPicker) {
      this.fontPicker = this.fpFallbackFont;
    }

    if (fontPicker !== this.fontPicker) {
      this.fontPickerChange.emit(this.fontPicker);
    }

    this.loadFont(this.fontPicker);
  }

  loadFont(font: Font) {
    try {
      WebFont.load({
        google: {
          families: [font.family + ':' + font.style]
        }
      });
    } catch (e) {
      console.warn('Problem with loading font:', font);
    }
  }

  fontChanged(value: Font) {
    this.fontPickerChange.emit(value);
  }
}
