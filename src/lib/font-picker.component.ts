import * as WebFont from 'webfontloader';

import { Subject } from 'rxjs/Subject';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';

import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { FontPickerService } from './font-picker.service';

import { Font, GoogleFonts, GoogleFontInterface } from './font-picker.interfaces';

@Component({
  selector: 'font-picker',
  templateUrl: './lib/font-picker.component.html',
  styleUrls: [ './lib/font-picker.component.css' ]
})
export class FontPickerComponent implements OnInit {
  public open: boolean;

  public loading: boolean;

  public top: number;
  public left: number;
  public position: string;

  public font: Font;
  public initialFont: Font;

  private styles: string[] = [];

  private testWidth: number;
  private testContainer: any;

  public listLabel: string;
  public selectedFont: boolean;
  public presetVisible: boolean;

  public arrowTop: number;
  public fontAmount: number = 10;
  public loadedFonts: number = 0;

  public presetFonts: Font[] = [];
  public googleFonts: Font[] = [];
  public currentFonts: Font[] = [];

  public fpWidth: number;
  public fpHeight: number;

  public fpPosition: string;
  public fpPositionOffset: number;

  public fpPresetLabel: string;
  public fpPresetFonts: Array<any>;

  public fpSizeSelect: boolean;
  public fpStyleSelect: boolean;

  public fpCancelButton: boolean;
  public fpCancelButtonText: string;
  public fpCancelButtonClass: string;

  public fpUploadButton: boolean;
  public fpUploadButtonText: string;
  public fpUploadButtonClass: string;

  public dialogArrowSize: number = 10;
  public dialogArrowOffset: number = 15;

  private listenerResize: any;
  private listenerMouseDown: any;

  private directiveInstance: any;
  private directiveElementRef: ElementRef;

  public searchTerm = new FormControl('');

  public renderMore: Subject<any> = new Subject();

  public config: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };

  @ViewChild('dialogPopup') dialogElement: any;

  @ViewChild('dialogScrollbar') scrollbar: PerfectScrollbarComponent;

  constructor(private cdRef: ChangeDetectorRef, public elRef: ElementRef, public service: FontPickerService) {
    this.loading = true;
    this.selectedFont = false;
    this.presetVisible = true;
  }

  ngOnInit() {
    this.searchTerm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((text) => {
      if (!text) {
        this.presetVisible = true;
        this.listLabel = 'Popular fonts';
      } else {
        this.presetVisible = false;
        this.listLabel = 'Search results';
      }

      this.searchGoogleFonts(text);
    });

    this.renderMore.pipe(
      debounceTime(150)
    ).subscribe(() => this.loadMoreFonts());

    this.testContainer = document.createElement('span');
    this.testContainer.innerHTML = Array(100).join('wi');

    this.testContainer.style.cssText = [
      'position: absolute',
      'width: auto',
      'font-size: 128px',
      'left: -99999px'
    ].join(' !important;');

    this.listenerResize = () => this.onResize();

    this.listenerMouseDown = (event: any) => this.onMouseDown(event);

    this.openFontPicker();
  }

  public setDialog(instance: any, elementRef: ElementRef, defaultFont: Font, fpPosition: string,
    fpPositionOffset: string, fpPositionRelativeToArrow: boolean, fpPresetLabel, fpPresetFonts,
    fpUploadButton: boolean, fpUploadButtonClass: string, fpUploadButtonText: string,
    fpStyleSelect: boolean, fpSizeSelect: boolean, fpCancelButton: boolean, fpCancelButtonClass: string,
    fpCancelButtonText: string, fpHeight: string, fpWidth: string)
  {
    this.listLabel = 'Loading fonts...';

    this.directiveInstance = instance;
    this.directiveElementRef = elementRef;

    this.updateDialog(defaultFont, fpPosition, fpPositionOffset, fpPositionRelativeToArrow,
      fpPresetLabel, fpPresetFonts, fpUploadButton, fpUploadButtonClass, fpUploadButtonText,
      fpStyleSelect, fpSizeSelect,  fpCancelButton, fpCancelButtonClass, fpCancelButtonText,
      fpHeight, fpWidth);

    this.service.getAllFonts('popularity').subscribe((fonts) => {
      this.loading = false;

      this.googleFonts = fonts.items.map((font) => this.convertGoogleFont(font));

      // Find styles for initial font
      const searchFont = this.findFont(this.initialFont.family, true);

      if (searchFont) {
        this.font.files = searchFont.files;
        this.font.styles = searchFont.styles;

        this.loadGoogleFonts([this.font]);
      }

      // Load Open Sans if available
      const openSans = this.googleFonts.find((font) => font.family === 'Open sans');

      this.loadGoogleFonts([openSans]);
    },
    err => console.log(err));
  }

  public updateDialog(font: Font, fpPosition: string, fpPositionOffset: string, fpPositionRelativeToArrow: boolean,
    fpPresetLabel, fpPresetFonts, fpUploadButton: boolean, fpUploadButtonClass: string, fpUploadButtonText: string,
    fpStyleSelect: boolean, fpSizeSelect: boolean,  fpCancelButton: boolean, fpCancelButtonClass: string,
    fpCancelButtonText: string, fpHeight: string, fpWidth: string)
  {
    this.font = font;
    this.styles = font.styles;

    this.initialFont = new Font(font);

    this.fpPosition = fpPosition;
    this.fpPositionOffset = parseInt(fpPositionOffset, 10);

    if (!fpPositionRelativeToArrow) {
      this.dialogArrowOffset = 0;
    }

    this.fpPresetLabel = fpPresetLabel;
    this.fpPresetFonts = fpPresetFonts;

    this.fpStyleSelect = fpStyleSelect;
    this.fpSizeSelect = fpSizeSelect;

    this.fpCancelButton = fpCancelButton;
    this.fpCancelButtonText = fpCancelButtonText;
    this.fpCancelButtonClass = fpCancelButtonClass;

    this.fpUploadButton = fpUploadButton;
    this.fpUploadButtonText = fpUploadButtonText;
    this.fpUploadButtonClass = fpUploadButtonClass;

    this.fpWidth = parseInt(fpWidth, 10);
    this.fpHeight = parseInt(fpHeight, 10);

    this.searchTerm.reset({disabled: (this.fpPresetFonts.length > 0)});

    this.setDisplayedFontSource();
  }

  public openFontPicker() {
    if (!this.open) {
      this.setDialogPosition();

      this.searchTerm.setValue('');

      window.addEventListener('resize', this.listenerResize);
      document.addEventListener('mousedown', this.listenerMouseDown);

      this.open = true;
    }
  }

  public closeFontPicker() {
    this.open = false;

    window.removeEventListener('resize', this.listenerResize);
    document.removeEventListener('mousedown', this.listenerMouseDown);
  }

  private isFontAvailable(font: Font) {
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

  private getPresetFonts() {
    const presetFonts = [];

    if (this.googleFonts && this.fpPresetFonts && this.fpPresetFonts.length) {
      this.fpPresetFonts.forEach((font) => {
        let fontClass = this.findFont(font, true);

        if (!fontClass) {
          fontClass = new Font( {
            family: font,
            size: null,
            style: null,
            styles: ['regular', 'italic']
          });
        }

        presetFonts.push(fontClass);
      });

      this.presetFonts = presetFonts;

      return presetFonts;
    }
  }

  private setDisplayedFontSource() {
    if (this.fpPresetFonts && this.fpPresetFonts.length) {
      this.setCurrentFonts(this.getPresetFonts());
    } else {
      this.setCurrentFonts(this.googleFonts);
    }
  }

  private setCurrentFonts(target: Font[]) {
    if (target !== this.currentFonts) {
      this.currentFonts = target;
      this.loadedFonts = this.fontAmount;

      const initialFonts = this.currentFonts.slice(0, this.fontAmount);

      this.loadGoogleFonts(initialFonts);

      this.cdRef.markForCheck();

      setTimeout(() => {
        this.scrollbar.directiveRef.scrollToY(0);
      }, 0);
    }
  }

  private findFont(searchVal, exactMatch: boolean = false): Font {
    return this.findFonts(searchVal, exactMatch)[0];
  }

  private findFonts(searchVal, exactMatch: boolean = false): Font[] {
    searchVal = searchVal.toLowerCase();

    const fullmatchFonts: Font[] = [];
    const candidateFonts: Font[] = [];

    this.googleFonts.forEach((font) => {
      if (searchVal === font.family.toLowerCase()) {
        fullmatchFonts.push(font);

        return;
      }

      if (!exactMatch && font.family.toLowerCase().indexOf(searchVal) > -1) {
        candidateFonts.push(font);
      }
    });

    const resultFonts: Font[] = fullmatchFonts.concat(candidateFonts);

    return resultFonts;
  }

  private loadMoreFonts() {
    if (this.open && !this.loading && this.loadedFonts < this.currentFonts.length) {
      const moreFonts = this.currentFonts.slice(this.loadedFonts, this.loadedFonts + this.fontAmount);

      this.loadGoogleFonts(moreFonts);

      this.loadedFonts += moreFonts.length;

      this.cdRef.markForCheck();

      setTimeout(() => {
        this.scrollbar.directiveRef.update();
      }, 0);
    }
  }

  loadGoogleFonts(fonts: Font[]) {
    fonts.slice(0, this.fontAmount).forEach((font: any) => {
      if (font && font.files && !this.isFontAvailable(font)) {
        const style = font.styles.indexOf('regular') > -1 ? '' : ':'  + font.styles.find((x: any) => !isNaN(x));

        try {
          WebFont.load({
            google: {
              families: [font.family + ':' + style]
            }
          });
        } catch (e) {
          console.warn('Problem with loading font:', font);
        }
      }
    });
  }

  private searchGoogleFonts(value: string) {
    if (!value) {
      this.onSearchReset();

      return;
    }

    value = value.toLowerCase();

    let searchResult: Font[] = Array();

    if (this.googleFonts) {
      this.loadedFonts = this.fontAmount;

      searchResult = this.findFonts(value, false);

      this.setCurrentFonts(searchResult);

      this.cdRef.markForCheck();
    }
  }

  private convertGoogleFont(font: GoogleFontInterface): Font {
    const convertedFont = new Font({
      family: font.family,
      styles: font.variants,
      files: font.files,
      style: null,
      size: null
    });

    return convertedFont;
  }

  public onResize() {
    if (this.position === 'fixed') {
      this.setDialogPosition();
    } else {
      this.closeFontPicker();
    }
  }

  public onMouseDown(event: any) {
    if (!this.isDescendant(this.elRef.nativeElement, event.target) &&
        event.target !== this.directiveElementRef.nativeElement)
    {
      this.closeFontPicker();
    }
  }

  public onUploadFiles() {
  }

  public onCancelSelect() {
    this.selectedFont = false;

    this.font.family = this.initialFont.family;
    this.font.size = this.initialFont.size;
    this.font.files = this.initialFont.files;
    this.font.style = this.initialFont.style;
    this.font.styles = this.initialFont.styles;

    this.closeFontPicker();

    this.directiveInstance.fontChanged(this.font);
  }

  public onSelectFont(font: any) {
    this.selectedFont = true;

    this.font.family = font.family;
    this.font.styles = font.styles;
    this.font.files = font.files;

    this.font.style = font.styles.indexOf('regular') > -1 ? 'regular' : font.styles[0];

    this.directiveInstance.fontChanged(this.font);
  }

  public onSearchReset(event?: any) {
    this.searchTerm.setValue('');

    this.setCurrentFonts(this.googleFonts);
  }

  public onFontSizeChange(event: any, font: Font) {
    this.font.size = event.target.value + 'px';

    this.directiveInstance.fontChanged(this.font);
  }

  public onFontStyleChange(event: any, font: Font) {
    const str = this.font.family + ':' +  event.target.value;

    if (font.files) {
      WebFont.load({
        google: {
          families: [str]
        }
      });
    }

    this.directiveInstance.fontChanged(this.font);
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

  private createDialogBox(element, offset): any {
    return {
      top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
      left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  private setDialogPosition() {
    let position = 'static';

    let parentNode = null;
    let boxDirective = null;

    let node = this.directiveElementRef.nativeElement;

    const dialogHeight = this.dialogElement.nativeElement.offsetHeight;

    while (node !== null && node.tagName !== 'HTML') {
      position = window.getComputedStyle(node).getPropertyValue('position');

      if (position !== 'static' && parentNode === null) {
        parentNode = node;
      }

      if (position === 'fixed') {
        break;
      }

      node = node.parentNode;
    }

    if (position !== 'fixed') {
      boxDirective = this.createDialogBox(this.directiveElementRef.nativeElement, true);

      if (parentNode === null) {
        parentNode = node;
      }

      const boxParent = this.createDialogBox(parentNode, true);

      this.top = boxDirective.top - boxParent.top;
      this.left = boxDirective.left - boxParent.left;
    } else {
      boxDirective = this.createDialogBox(this.directiveElementRef.nativeElement, false);

      this.top = boxDirective.top;
      this.left = boxDirective.left;
      this.position = 'fixed';
    }

    if (!this.fpWidth) {
      this.fpWidth = boxDirective.width;
    }

    if (!this.fpHeight) {
      this.fpHeight = boxDirective.height;
    }

    if (this.fpPosition === 'left') {
      this.top += boxDirective.height * this.fpPositionOffset / 100 - this.dialogArrowOffset;
      this.left -= this.fpWidth + this.dialogArrowSize;
    } else if (this.fpPosition === 'top') {
      this.top -= dialogHeight + this.dialogArrowSize;
      this.left += this.fpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset - 1;
      this.arrowTop = dialogHeight - 1;
    } else if (this.fpPosition === 'bottom') {
      this.top += boxDirective.height + this.dialogArrowSize;
      this.left += this.fpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset - 1;
    } else {
      this.top += boxDirective.height * this.fpPositionOffset / 100 - this.dialogArrowOffset;
      this.left += boxDirective.width + this.dialogArrowSize;
    }
  }
}
