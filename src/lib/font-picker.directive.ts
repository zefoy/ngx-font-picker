import { Observable } from 'rxjs/Rx';

import { Directive, OnInit, Input, Output, EventEmitter, ElementRef, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';

import { Font } from './interfaces';
import { DialogModule } from "./dialog.module";
import { DialogComponent } from './dialog.component';

@Directive({
  selector: '[fontPicker]',
  host: {
    '(click)': 'onClick()'
  }
})
export class FontPickerDirective implements OnInit {
  private dialog: any;

  @Input('fontPicker') fontPicker: Font;

  @Input('fpWidth') fpWidth: string = '280px';
  @Input('fpHeight') fpHeight: string = '320px';

  @Input('fpFallbackFont') fpFallbackFont: Font = new Font({
    family: 'Roboto',
    size: 14,
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

  constructor(private resolver: ComponentFactoryResolver, private el: ElementRef, private vc: ViewContainerRef) {}

  ngOnInit() {
    let fontPicker = this.fontPicker;

    if (!this.fontPicker) {
      this.fontPicker = this.fpFallbackFont;
    }

    if (fontPicker != this.fontPicker) {
      this.fontPickerChange.emit(this.fontPicker);
    }
  }

  onClick() {
    if (!this.dialog) {
      const compFactory = this.resolver.resolveComponentFactory(DialogComponent);
      const injector = ReflectiveInjector.fromResolvedProviders([], this.vc.parentInjector);

      this.dialog = this.vc.createComponent(compFactory, 0, injector, []).instance;

      this.dialog.setDialog(this, this.el, this.fontPicker, this.fpPosition, this.fpPositionOffset, this.fpPositionRelativeToArrow, this.fpPresetLabel, this.fpPresetFonts, this.fpUploadButton, this.fpUploadButtonClass, this.fpUploadButtonText, this.fpStyleSelect, this.fpSizeSelect ,this.fpCancelButton, this.fpCancelButtonClass, this.fpCancelButtonText, this.fpHeight, this.fpWidth);
    } else if (!this.dialog.open) {
      this.dialog.updateDialog(this.fontPicker, this.fpPosition, this.fpPositionOffset, this.fpPositionRelativeToArrow, this.fpPresetLabel, this.fpPresetFonts, this.fpUploadButton, this.fpUploadButtonClass, this.fpUploadButtonText, this.fpStyleSelect, this.fpSizeSelect, this.fpCancelButton, this.fpCancelButtonClass, this.fpCancelButtonText, this.fpHeight, this.fpWidth);

      this.dialog.openFontPicker();
    } else {
      this.dialog.closeFontPicker();
    }
  }
}
