import { Directive, OnInit, OnChanges, Input, Output, EventEmitter,
  HostListener, ElementRef, ViewContainerRef, SimpleChanges,
  ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';

import { FontInterface } from './font-picker.interfaces';

import { FontPickerService } from './font-picker.service';

import { FontPickerComponent } from './font-picker.component';

@Directive({
  selector: '[fontPicker]'
})
export class FontPickerDirective implements OnInit, OnChanges {
  private dialog: any;

  @Input('fontPicker') fontPicker: FontInterface;

  @Input('fpWidth') fpWidth: string = '280px';
  @Input('fpHeight') fpHeight: string = '320px';

  @Input('fpFallbackFont') fpFallbackFont: FontInterface = {
    family: 'Roboto',
    size: '16px',
    style: 'regular',
    styles: ['regular']
  };

  @Input('fpAutoLoad') fpAutoLoad: boolean = true;

  @Input('fpPresetLabel') fpPresetLabel: string = '';
  @Input('fpPresetFonts') fpPresetFonts: string[] = [];

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

  @Output('fontPickerChange') fontPickerChange = new EventEmitter<FontInterface>();

  @HostListener('click', ['$event']) onClick(event: Event) {
    this.toggleDialog();
  }

  constructor(private resolver: ComponentFactoryResolver, private el: ElementRef,
    private vc: ViewContainerRef, private service: FontPickerService) {}

  ngOnInit() {
    this.fontPicker = this.fontPicker || this.fpFallbackFont;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fontPicker) {
      this.fontPicker = this.fontPicker || this.fpFallbackFont;

      if (this.fpAutoLoad) {
        this.loadFont(this.fontPicker);
      }
    }
  }

  public loadFont(font: FontInterface) {
    this.service.loadFont(font);
  }

  public openDialog() {
    if (!this.dialog || !this.dialog.open) {
      this.toggleDialog();
    }
  }

  public closeDialog() {
    if (this.dialog && this.dialog.open) {
      this.toggleDialog();
    }
  }

  public toggleDialog() {
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

  public fontChanged(font: FontInterface) {
    this.fontPickerChange.emit(font);
  }
}
