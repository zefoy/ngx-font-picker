import { Observable } from 'rxjs/Rx';

import { Compiler, Directive, OnInit, Input, Output, EventEmitter, ElementRef, ReflectiveInjector, ChangeDetectorRef, ViewContainerRef } from '@angular/core';

import { FontPickerService } from './font-picker.service';
import { FontPickerComponent } from './font-picker.component';
import { DynamicFontPickerModule } from './font-picker.modules';

import { Font } from './interfaces';

@Directive({
  selector: '[fontPicker]',
  host: {
    '(click)': 'onClick()'
  }
})
export class FontPickerDirective implements OnInit {
  private dialog: any;

  private created: boolean = false;

  @Input('fontPicker') fontPicker: Font;

  @Input('fpWidth') fpWidth: string = '280px';
  @Input('fpHeight') fpHeight: string = '320px';

  @Input('fpFallbackFont') fpFallbackFont: Font = new Font({
    family: 'Roboto',
    styles: ['regular'],
    style: 'regular',
    size: 14
  });

  @Input('fpPresetLabel') fpPresetLabel: string;
  @Input('fpPresetFonts') fpPresetFonts: Array<string>;

  @Input('fpIgnoredElements') fpIgnoredElements: any = [];

  @Input('fpPosition') fpPosition: string = 'right';
  @Input('fpPositionOffset') fpPositionOffset: string = '0%';
  @Input('fpPositionRelativeToArrow') fpPositionRelativeToArrow: boolean = false;

  @Input('fpCancelButton') fpCancelButton: boolean = false;
  @Input('fpCancelButtonText') fpCancelButtonText: string = 'Cancel';
  @Input('fpCancelButtonClass') fpCancelButtonClass: string = 'fp-cancel-button-class';

  @Input('fpUploadButton') fpUploadButton: boolean = false;
  @Input('fpUploadButtonText') fpUploadButtonText: string = 'Upload';
  @Input('fpUploadButtonClass') fpUploadButtonClass: string = 'fp-upload-button-class';

  @Output('fontPickerChange') fontPickerChange = new EventEmitter<Font>();

  constructor( private compiler: Compiler, private el: ElementRef, private vc: ViewContainerRef, private cd : ChangeDetectorRef, private service: FontPickerService ) { }

  ngOnInit() {
		var fontPicker = this.fontPicker;

		if (!this.fontPicker) {
			this.fontPicker = this.fpFallbackFont;
		}

    this.fontPickerChange.emit(this.fontPicker);

		if (fontPicker != this.fontPicker) {
      this.cd.detectChanges();
    }
  }

  onClick() {
    if (this.fpIgnoredElements.filter((item: any) => item === this.el.nativeElement).length === 0) {
      this.openDialog();
    }
  }

  openDialog() {
    if (!this.created) {
      this.created = true;

      this.compiler.compileModuleAndAllComponentsAsync(DynamicFontPickerModule)
        .then((factory) => {
          const compFactory = factory.componentFactories.find(x => x.componentType === FontPickerComponent);
          const injector = ReflectiveInjector.fromResolvedProviders([], this.vc.parentInjector);
          const cmpRef = this.vc.createComponent(compFactory, 0, injector, []);

          cmpRef.instance.setDialog(this, this.el, this.fontPicker, this.fpPosition, this.fpPositionOffset,
            this.fpPositionRelativeToArrow, this.fpPresetLabel, this.fpPresetFonts,
            this.fpUploadButton, this.fpUploadButtonClass, this.fpUploadButtonText, 
            this.fpCancelButton, this.fpCancelButtonClass, this.fpCancelButtonText, 
            this.fpHeight, this.fpWidth, this.fpIgnoredElements);

          this.dialog = cmpRef.instance;
        });
    } else if (this.dialog) {
      this.dialog.updateDialog(this.fontPicker, this.fpPresetLabel, this.fpPresetFonts)

      this.dialog.openFontPicker();
    }
  }
}
