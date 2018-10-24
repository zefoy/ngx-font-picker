import * as WebFont from 'webfontloader';

import { Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, HostListener,
  ChangeDetectorRef, ViewEncapsulation } from '@angular/core';

import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { Font, FontInterface, GoogleFontInterface, GoogleFontsInterface } from './font-picker.interfaces';

import { FontPickerService } from './font-picker.service';

@Component({
  selector: 'font-picker',
  templateUrl: '../../dist/lib/font-picker.component.html',
  styleUrls: [ '../../dist/lib/font-picker.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class FontPickerComponent implements OnInit {
  private initialFont: Font;

  private testWidth: number;
  private testContainer: any;

  private autoWidth: boolean;

  private listenerResize: any;
  private listenerMouseDown: any;

  private directiveInstance: any;
  private directiveElementRef: ElementRef;

  private useRootViewContainer: boolean = false;

  public font: Font;

  public open: boolean;
  public loading: boolean;

  public top: number;
  public left: number;
  public position: string;

  public arrowTop: number;
  public listLabel: string;
  public selectedFont: boolean;
  public presetVisible: boolean;

  public fontAmount: number = 10;
  public loadedFonts: number = 0;

  public presetFonts: Font[] = [];
  public googleFonts: Font[] = [];
  public currentFonts: Font[] = [];

  public fpWidth: number;
  public fpHeight: number;

  public fpPosition: string;
  public fpPositionOffset: number;

  public fpSearchText: string;
  public fpLoadingText: string;

  public fpPopularLabel: string;
  public fpResultsLabel: string;

  public fpPresetLabel: string;
  public fpPresetFonts: string[];
  public fpPresetNotice: string;

  public fpSizeSelect: boolean;
  public fpStyleSelect: boolean;

  public fpCancelButton: boolean;
  public fpCancelButtonText: string;
  public fpCancelButtonClass: string;

  public fpUploadButton: boolean;
  public fpUploadButtonText: string;
  public fpUploadButtonClass: string;

  public fpDialogDisplay: string;

  public dialogArrowSize: number = 10;
  public dialogArrowOffset: number = 15;

  public searchTerm = new FormControl('');

  public renderMore: Subject<any> = new Subject();

  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
    wheelPropagation: false
  };

  @ViewChild('dialogPopup') dialogElement: ElementRef;

  @ViewChild('dialogScrollbar') scrollbar: PerfectScrollbarComponent;

  @HostListener('document:keyup.esc', ['$event']) handleEsc(event: any): void {
    if (this.open && this.fpDialogDisplay === 'popup') {
      this.onCancelSelect(event);
    }
  }

  @HostListener('document:keyup.enter', ['$event']) handleEnter(event: any): void {
    if (this.open && this.fpDialogDisplay === 'popup') {
      this.onAcceptSelect(event);
    }
  }

  constructor(private cdRef: ChangeDetectorRef, public elRef: ElementRef,
    public service: FontPickerService)
  {
    this.loading = true;

    this.selectedFont = false;
    this.presetVisible = true;
  }

  ngOnInit(): void {
    this.renderMore.pipe(
      debounceTime(150)
    ).subscribe(() => this.loadMoreFonts());

    this.searchTerm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((text) => {
      if (!text) {
        this.presetVisible = true;
        this.listLabel = this.fpPopularLabel;
      } else {
        this.presetVisible = false;
        this.listLabel = this.fpResultsLabel;
      }

      this.searchGoogleFonts(text);
    });

    this.testContainer = document.createElement('span');

    this.testContainer.innerHTML = Array(100).join('wi');

    this.testContainer.style.cssText = [
      'position: absolute',
      'left: -99999px',
      'width: auto',
      'font-size: 128px'
    ].join(' !important;');

    this.listenerResize = (event: any) => this.onResize();

    this.listenerMouseDown = (event: any) => this.onMouseDown(event);

    this.openFontPicker();
  }

  public trackFont(index: number, font: FontInterface): string {
    return font.family || index.toString();
  }

  public setDialog(instance: any, elementRef: ElementRef, fpUseRootViewContainer: boolean,
    defaultFont: FontInterface, fpWidth: string, fpHeight: string,
    fpDialogDisplay: string, fpSizeSelect: boolean, fpStyleSelect: boolean,
    fpPosition: string, fpPositionOffset: string, fpPositionRelativeToArrow: boolean,
    fpSearchText: string, fpLoadingText: string, fpPopularLabel: string, fpResultsLabel: string,
    fpPresetLabel: string, fpPresetFonts: string[], fpPresetNotice: string,
    fpCancelButton: boolean, fpCancelButtonText: string, fpCancelButtonClass: string,
    fpUploadButton: boolean, fpUploadButtonText: string, fpUploadButtonClass: string): void
  {
    this.listLabel = fpLoadingText;

    this.directiveInstance = instance;
    this.directiveElementRef = elementRef;

    this.useRootViewContainer = fpUseRootViewContainer;

    this.updateDialog(defaultFont, fpWidth, fpHeight, fpDialogDisplay, fpSizeSelect, fpStyleSelect,
      fpPosition, fpPositionOffset, fpPositionRelativeToArrow, fpSearchText, fpLoadingText,
      fpPopularLabel, fpResultsLabel, fpPresetLabel, fpPresetFonts, fpPresetNotice, fpCancelButton,
      fpCancelButtonText, fpCancelButtonClass, fpUploadButton, fpUploadButtonText, fpUploadButtonClass);

    this.service.getAllFonts('popularity').subscribe((fonts: GoogleFontsInterface) => {
      this.loading = false;

      if (fonts.items) {
        this.googleFonts = fonts.items.map((font: GoogleFontInterface) => {
          return new Font({
            files: font.files,
            family: font.family,
            styles: font.variants
          });
        });
      }

      // Find styles for initial font
      const searchFont = this.findFont(this.initialFont.family, true);

      if (searchFont) {
        this.font.files = searchFont.files;
        this.font.styles = searchFont.styles;

        this.loadGoogleFonts([this.font]);
      }

      // Load Open Sans if available
      const openSans = this.googleFonts.find((font) => font.family === 'Open sans');

      if (openSans) {
        this.loadGoogleFonts([openSans]);
      }

      this.setDisplayedFontSource();
    },
    (error: any) => console.error(error));
  }

  public updateDialog(font: FontInterface, fpWidth: string, fpHeight: string,
    fpDialogDisplay: string, fpSizeSelect: boolean, fpStyleSelect: boolean,
    fpPosition: string, fpPositionOffset: string, fpPositionRelativeToArrow: boolean,
    fpSearchText: string, fpLoadingText: string, fpPopularLabel: string, fpResultsLabel: string,
    fpPresetLabel: string, fpPresetFonts: string[], fpPresetNotice: string,
    fpCancelButton: boolean, fpCancelButtonText: string, fpCancelButtonClass: string,
    fpUploadButton: boolean, fpUploadButtonText: string, fpUploadButtonClass: string): void
  {
    this.font = new Font(font);
    this.initialFont = new Font(font);

    this.fpPosition = fpPosition;
    this.fpPositionOffset = parseInt(fpPositionOffset, 10);

    if (!fpPositionRelativeToArrow) {
      this.dialogArrowOffset = 0;
    }

    if (fpDialogDisplay === 'inline') {
      this.dialogArrowSize = 0;
      this.dialogArrowOffset = 0;
    }

    this.fpSearchText = fpSearchText;
    this.fpLoadingText = fpLoadingText;

    this.fpPopularLabel = fpPopularLabel;
    this.fpResultsLabel = fpResultsLabel;

    this.fpSizeSelect = fpSizeSelect;
    this.fpStyleSelect = fpStyleSelect;

    this.fpPresetLabel = fpPresetLabel;
    this.fpPresetFonts = fpPresetFonts;
    this.fpPresetNotice = fpPresetNotice;

    this.fpCancelButton = fpCancelButton;
    this.fpCancelButtonText = fpCancelButtonText;
    this.fpCancelButtonClass = fpCancelButtonClass;

    this.fpUploadButton = fpUploadButton;
    this.fpUploadButtonText = fpUploadButtonText;
    this.fpUploadButtonClass = fpUploadButtonClass;

    this.autoWidth = fpWidth === 'auto';

    this.fpWidth = parseInt(fpWidth, 10);
    this.fpHeight = parseInt(fpHeight, 10);

    this.fpDialogDisplay = fpDialogDisplay;

    this.setDisplayedFontSource();

    this.searchTerm.reset({disabled: (this.fpPresetFonts.length > 0)});
  }

  public openFontPicker(): void {
    if (!this.open) {
      this.setDialogPosition();

      this.searchTerm.setValue('');

      window.addEventListener('resize', this.listenerResize);

      document.addEventListener('mousedown', this.listenerMouseDown);

      this.open = true;
    }
  }

  public closeFontPicker(): void {
    this.open = false;

    window.removeEventListener('resize', this.listenerResize);

    document.removeEventListener('mousedown', this.listenerMouseDown);
  }

  private isFontAvailable(font: Font): boolean {
    if (!this.testWidth) {
      this.testContainer.style.fontFamily = 'monospace';

      document.body.appendChild(this.testContainer);

      this.testWidth = this.testContainer.clientWidth;

      document.body.removeChild(this.testContainer);
    }

    this.testContainer.style.fontFamily = font.family + ', monospace';

    document.body.appendChild(this.testContainer);

    const width = this.testContainer.clientWidth;

    document.body.removeChild(this.testContainer);

    return width !== this.testWidth;
  }

  private getPresetFonts(): Font[] {
    const presetFonts: Font[] = [];

    if (this.googleFonts && this.fpPresetFonts && this.fpPresetFonts.length) {
      this.fpPresetFonts.forEach((font: string) => {
        let fontClass = this.findFont(font, true);

        if (!fontClass) {
          fontClass = new Font({
            family: font,
            styles: ['regular', 'italic']
          });
        }

        presetFonts.push(fontClass);
      });

      this.presetFonts = presetFonts;
    }

    return presetFonts;
  }

  private setDisplayedFontSource(): void {
    if (this.fpPresetFonts && this.fpPresetFonts.length) {
      this.setCurrentFonts(this.getPresetFonts());
    } else {
      this.setCurrentFonts(this.googleFonts);
    }
  }

  private setCurrentFonts(target: Font[]): void {
    if (target !== this.currentFonts) {
      this.currentFonts = target;
      this.loadedFonts = this.fontAmount;

      const initialFonts = this.currentFonts.slice(0, this.fontAmount);

      this.loadGoogleFonts(initialFonts);

      this.cdRef.markForCheck();

      setTimeout(() => {
        if (this.scrollbar && this.scrollbar.directiveRef) {
          this.scrollbar.directiveRef.scrollToY(0);
        }
      }, 0);
    }
  }

  private findFont(searchVal, exactMatch: boolean = false): Font {
    return this.findFonts(searchVal, exactMatch)[0];
  }

  private findFonts(searchVal, exactMatch: boolean = false): Font[] {
    const fullmatchFonts: Font[] = [];
    const candidateFonts: Font[] = [];

    searchVal = searchVal.toLowerCase();

    this.googleFonts.forEach((font: Font) => {
      if (searchVal === font.family.toLowerCase()) {
        fullmatchFonts.push(font);

        return;
      }

      if (!exactMatch && font.family.toLowerCase().indexOf(searchVal) > -1) {
        candidateFonts.push(font);
      }
    });

    const resultFonts = fullmatchFonts.concat(candidateFonts);

    return resultFonts;
  }

  private loadMoreFonts(): void {
    if (this.open && !this.loading && this.loadedFonts < this.currentFonts.length) {
      const moreFonts = this.currentFonts.slice(this.loadedFonts, this.loadedFonts + this.fontAmount);

      this.loadGoogleFonts(moreFonts);

      this.loadedFonts += moreFonts.length;

      setTimeout(() => {
        if (this.scrollbar && this.scrollbar.directiveRef) {
          this.scrollbar.directiveRef.update();
        }
      }, 0);

      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    }
  }

  private loadGoogleFonts(fonts: Font[]): void {
    fonts.slice(0, this.fontAmount).forEach((font: any) => {
      if (font && font.files && !this.isFontAvailable(font)) {
        const style = (font.styles.indexOf('regular') > -1) ?
          '' : ':'  + font.styles.find((x: any) => !isNaN(x));

        this.service.loadFont({ family: font.family, style: style, size: font.size });
      }
    });
  }

  private searchGoogleFonts(value: string): void {
    if (!value) {
      this.searchTerm.setValue('');

      this.setCurrentFonts(this.googleFonts);
    } else {
      value = value.toLowerCase();

      if (this.googleFonts) {
        this.loadedFonts = this.fontAmount;

        const searchResult = this.findFonts(value, false);

        this.setCurrentFonts(searchResult);

        this.cdRef.markForCheck();
      }
    }
  }

  private isDescendant(parent, child): boolean {
    let node = child.parentNode;

    while (node !== null) {
      if (node === parent) {
        return true;
      }

      node = node.parentNode;
    }

    return false;
  }

  private createDialogBox(element, offset): {top: number, left: number, width: number, height: number} {
    return {
      top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
      left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  private setDialogPosition(): void {
    if (this.fpDialogDisplay === 'inline') {
      this.position = 'relative';
    } else {
      let position = 'static', transform = '', style;

      let parentNode: any = null, transformNode: any = null;

      let node = this.directiveElementRef.nativeElement.parentNode;

      const dialogHeight = this.dialogElement.nativeElement.offsetHeight;

      while (node !== null && node.tagName !== 'HTML') {
        style = window.getComputedStyle(node);
        position = style.getPropertyValue('position');
        transform = style.getPropertyValue('transform');

        if (position !== 'static' && parentNode === null) {
          parentNode = node;
        }

        if (transform && transform !== 'none' && transformNode === null) {
          transformNode = node;
        }

        if (position === 'fixed') {
          parentNode = transformNode;

          break;
        }

        node = node.parentNode;
      }

      const boxDirective = this.createDialogBox(this.directiveElementRef.nativeElement, (position !== 'fixed'));

      if (this.autoWidth) {
        this.fpWidth = this.directiveElementRef.nativeElement.offsetWidth;
      }

      if (this.useRootViewContainer || (position === 'fixed' && !parentNode)) {
        this.top = boxDirective.top;
        this.left = boxDirective.left;
      } else {
        if (parentNode === null) {
          parentNode = node;
        }

        const boxParent = this.createDialogBox(parentNode, (position !== 'fixed'));

        this.top = boxDirective.top - boxParent.top;
        this.left = boxDirective.left - boxParent.left;
      }

      if (position === 'fixed') {
        this.position = 'fixed';
      }

      if (this.fpPosition === 'left') {
        this.top += boxDirective.height * this.fpPositionOffset / 100 - this.dialogArrowOffset;
        this.left -= this.fpWidth + this.dialogArrowSize - 2;
      } else if (this.fpPosition === 'top') {
        this.arrowTop = dialogHeight - 1;

        this.top -= dialogHeight + this.dialogArrowSize;
        this.left += this.fpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
      } else if (this.fpPosition === 'bottom') {
        this.top += boxDirective.height + this.dialogArrowSize;
        this.left += this.fpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
      } else {
        this.top += boxDirective.height * this.fpPositionOffset / 100 - this.dialogArrowOffset;
        this.left += boxDirective.width + this.dialogArrowSize - 2;
      }
    }
  }

  private onResize(): void {
    if (this.position === 'fixed') {
      this.setDialogPosition();
    } else if (this.fpDialogDisplay !== 'inline') {
      this.closeFontPicker();
    }
  }

  private onMouseDown(event: any): void {
    if (this.fpDialogDisplay === 'popup' &&
        event.target !== this.directiveElementRef.nativeElement &&
        !this.isDescendant(this.elRef.nativeElement, event.target) &&
        !this.isDescendant(this.directiveElementRef.nativeElement, event.target))
    {
      this.closeFontPicker();

      this.cdRef.markForCheck();
    }
  }

  public onUploadFont(event: any): void {
    event.stopPropagation();

    this.directiveInstance.uploadFont();
  }

  public onAcceptSelect(event: any): void {
    event.stopPropagation();

    this.directiveInstance.fontChanged(this.font);

    if (this.fpDialogDisplay === 'popup') {
      this.closeFontPicker();
    }
  }

  public onCancelSelect(event: any): void {
    event.stopPropagation();

    this.selectedFont = false;

    this.font.size = this.initialFont.size;
    this.font.files = this.initialFont.files;
    this.font.style = this.initialFont.style;
    this.font.family = this.initialFont.family;
    this.font.styles = this.initialFont.styles;

    this.directiveInstance.fontChanged(this.font);

    if (this.fpDialogDisplay === 'popup') {
      this.closeFontPicker();
    }
  }

  public onSelectFont(font: any): void {
    this.selectedFont = true;

    this.font.files = font.files;
    this.font.family = font.family;
    this.font.styles = font.styles;

    this.font.style = (font.styles.indexOf('regular') !== -1) ?
      'regular' : font.styles[0];

    this.directiveInstance.fontChanged(this.font);

    this.cdRef.markForCheck();
    this.cdRef.detectChanges();
  }

  public onSearchReset(event: any): void {
    event.stopPropagation();

    this.searchTerm.setValue('');

    this.setCurrentFonts(this.googleFonts);
  }

  public onFontSizeChange(event: any): void {
    this.font.size = event.target.value + 'px';

    this.directiveInstance.fontChanged(this.font);
  }

  public onFontStyleChange(event: any, font: Font): void {
    const str = this.font.family + ':' +  event.target.value;

    if (font.files) {
      WebFont.load({
        google: {
          families: [ str ]
        }
      });
    }

    this.directiveInstance.fontChanged(this.font);
  }
}
