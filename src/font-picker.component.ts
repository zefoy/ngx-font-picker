import * as WebFont from 'webfontloader';

import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

import { Observable } from 'rxjs/Rx';

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { FormControl } from '@angular/forms';

import { PerfectScrollbarComponent, PerfectScrollbarConfigInterface } from 'angular2-perfect-scrollbar';

import { FontPickerService } from './font-picker.service';

import { Font, GoogleFonts, GoogleFontInterface } from './interfaces';

@Component({
  selector: 'font-picker',
  template: require('font-picker.component.html'),
  styles: [require('font-picker.component.scss')]
})
export class FontPickerComponent implements OnInit {
  private config: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
  };

  private show: boolean;

  private loading: boolean;
  private presetVisible: boolean;

  private top: number;
  private left: number;
  private position: string;

  private listLabel: string;

  private testWidth: number;
  private testContainer: any;

  private font: Font;
  private initialFont: Font;

  private styles: string[] = [];

  private currentFonts: Font[];
  private presetFonts: Font[] = [];
  private googleFonts: Font[] = [];

  private directiveInstance: any;
  private directiveElementRef: ElementRef;

  private listenerResize: any;
  private listenerMouseDown: any;

  private fpWidth: number;
  private fpHeight: number;

  private fpPosition: string;
  private fpPositionOffset: number;

  private fpPresetLabel: string;
  private fpPresetFonts: Array<any>;

  private fpCancelButton: boolean;
  private fpCancelButtonText: string;
  private fpCancelButtonClass: string;

  private fpUploadButton: boolean;
  private fpUploadButtonText: string;
  private fpUploadButtonClass: string;

  private arrowTop: number;
  private dialogArrowSize: number = 10;
  private dialogArrowOffset: number = 15;

  private searchTerm = new FormControl('');

  private fontAmount: number = 5;
  private loadedFonts: number = 0;

  @ViewChild(PerfectScrollbarComponent) scrollbar: PerfectScrollbarComponent;

  constructor( private el: ElementRef, private service: FontPickerService ) {
    this.loading = true;
    this.presetVisible = true;
  }

  setDialog(instance: any, elementRef: ElementRef, font: Font, fpPosition: string, fpPositionOffset: string, fpPositionRelativeToArrow: boolean, fpPresetLabel, fpPresetFonts, fpUploadButton: boolean, fpUploadButtonClass: string, fpUploadButtonText: string,  fpCancelButton: boolean, fpCancelButtonClass: string, fpCancelButtonText: string, fpHeight: string, fpWidth: string) {
    this.font = font;
    this.initialFont = font;
    this.styles = font.styles;

    this.directiveInstance = instance;
    this.directiveElementRef = elementRef;

    this.fpPosition = fpPosition;
    this.fpPositionOffset = parseInt(fpPositionOffset);

    if (!fpPositionRelativeToArrow) {
        this.dialogArrowOffset = 0;
    }

    this.fpPresetLabel = fpPresetLabel;
    this.fpPresetFonts = fpPresetFonts;

    this.fpCancelButton = fpCancelButton;
    this.fpCancelButtonText = fpCancelButtonText;
    this.fpCancelButtonClass = fpCancelButtonClass;

    this.fpUploadButton = fpUploadButton;
    this.fpUploadButtonText = fpUploadButtonText;
    this.fpUploadButtonClass = fpUploadButtonClass;

    this.fpWidth = parseInt(fpWidth);
    this.fpHeight = parseInt(fpHeight);

    this.searchTerm.reset({disabled: (this.fpPresetFonts.length > 0)});

    this.listLabel = "Loading fonts...";

    this.service.getAllFonts('popularity').subscribe((data) => {
      this.loading = false;

      this.googleFonts = data.items.map(font => this.convertGoogleFont(font));

      // Find styles for initial font
      let searchFont = this.findFont(this.initialFont.family, true);

      if(searchFont) {
        this.font.files = searchFont.files;
        this.font.styles = searchFont.styles;
        this.loadGoogleFonts([this.font]);
      }

      // Load Open Sans if available
      let openSans = this.googleFonts.find(font => font.family == "Open sans");

      this.loadGoogleFonts([openSans]);

      this.setDisplayedFontSource();
    },
    err => console.log(err));
  }

  convertGoogleFont(font: GoogleFontInterface): Font {
    let convertedFont = new Font({
      family: font.family,
      styles: font.variants,
      files: font.files,
      style: null,
      size: 14
    });

    return convertedFont;
  }

  updateDialog(font: Font, fpPresetLabel, fpPresetFonts) {
    this.initialFont = font;

    this.styles = font.styles;

    this.fpPresetLabel = fpPresetLabel;
    this.fpPresetFonts = fpPresetFonts;

    this.searchTerm.reset({disabled: (this.fpPresetFonts.length > 0)});

    this.setDisplayedFontSource();
  }

  setDisplayedFontSource() {
    if (this.fpPresetFonts && this.fpPresetFonts.length) {
      this.setcurrentFonts(this.getPresetFonts());
    } else {
      this.setcurrentFonts(this.googleFonts);
    }
  }

  getPresetFonts() {
    var presetFonts = [];

    if (this.googleFonts && this.fpPresetFonts && this.fpPresetFonts.length) {
      this.fpPresetFonts.forEach(font => {
        let fontClass = this.findFont(font, true);

        if (!fontClass) {
          fontClass = new Font( {
            family: font,
            size: 14,
            style: "regular",
            styles: ["regular", "italic", "700", "700italic"]
          });
        }

        presetFonts.push(fontClass);
      });

      this.presetFonts = presetFonts;

      return presetFonts;
    }
  }

  setcurrentFonts(target: Font[]) {
    if (target == this.currentFonts) return;

    this.currentFonts = target;
    this.loadedFonts = this.fontAmount;

    let initialFonts = this.currentFonts.slice(0, this.fontAmount);

    this.loadGoogleFonts(initialFonts);

    setTimeout(() => { this.scrollbar.scrollTo(0); }, 0);
  }

  findFont(searchVal, exactMatch:boolean = false): Font {
    return this.findFonts(searchVal, exactMatch)[0];
  }

  findFonts(searchVal, exactMatch:boolean = false) : Font[] {
    searchVal = searchVal.toLowerCase();

    let fullmatchFonts: Font[] = [];
    let candidateFonts: Font[] = [];

    this.googleFonts.forEach(font => {
      if (searchVal === font.family.toLowerCase()) {
        fullmatchFonts.push(font);

        return;
      }

      if (exactMatch == false && font.family.toLowerCase().includes(searchVal)) {
        candidateFonts.push(font);
      }
    });

    let resultFonts: Font[] = fullmatchFonts.concat(candidateFonts);

    return resultFonts;
  }

  ngOnInit() {
    this.searchTerm
      .valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe((text) => {
        if (!text) {
          this.presetVisible = true;
          this.listLabel = "Popular fonts";
        } else {
          this.presetVisible = false;
          this.listLabel = "Search results";
        }

        this.searchGoogleFonts(text);
      });

      // Used to handle font loading. Don't allow too many loading requests in a short time span.
      const scrollEndStream = Observable.fromEvent(this.el.nativeElement, 'ps-y-reach-end').debounceTime(150);

      scrollEndStream.subscribe(_ => { this.loadMoreFonts() });

      this.testContainer = document.createElement('span');
      this.testContainer.innerHTML = Array(100).join('wi');

      this.testContainer.style.cssText = [
        'position:absolute',
        'width:auto',
        'font-size:128px',
        'left:-99999px'
      ].join(' !important;');

    this.listenerResize = () => { this.onResize() };
    this.listenerMouseDown = (event: any) => { this.onMouseDown(event) };

    this.openFontPicker();
  }

  onResize() {
    if (this.position === 'fixed') {
      this.setDialogPosition();
    }
  }

  onMouseDown(event: any) {
    if (!this.isDescendant(this.el.nativeElement, event.target) &&
      event.target != this.directiveElementRef.nativeElement) {
      this.closeFontPicker();
    }
  }

  onSelectFont(font: any) {
    var size = this.font.size;

    this.font.family = font.family;
    this.font.styles = font.styles;
    this.font.files = font.files;
    this.font.size = size;

    this.font.style = font.styles.indexOf("regular") > -1 ? "regular" : font.styles[0];
  }

  loadMoreFonts() {
    if (this.loading == false && this.loadedFonts < this.currentFonts.length) {
      let moreFonts = this.currentFonts.slice(this.loadedFonts, this.loadedFonts + this.fontAmount);

      this.loadGoogleFonts(moreFonts);

      this.loadedFonts += moreFonts.length;

      setTimeout(() => { this.scrollbar.update(); }, 0);
    }
  }

  onSearchReset(event?: any) {
    this.searchTerm.setValue('');
    this.setcurrentFonts(this.googleFonts);
  }

  searchGoogleFonts(value: string){
    if (!value) {
      this.onSearchReset();

      return;
    }

    value = value.toLowerCase();

    let searchResult: Font[] = Array();

    if (this.googleFonts) {
      this.loadedFonts = this.fontAmount;
      searchResult = this.findFonts(value, false);

      this.setcurrentFonts(searchResult);
    }
  }

  isDescendant(parent, child): boolean {
    var node = child.parentNode;

    while (node !== null) {
      if (node === parent) {
        return true;
      }

      node = node.parentNode;
    }

    return false;
  }

  openFontPicker() {
    if (!this.show) {
      this.setDialogPosition();

      this.searchTerm.setValue('');

      window.addEventListener('resize', this.listenerResize);
      document.addEventListener('mousedown', this.listenerMouseDown);

      this.show = true;
    }
  }

  closeFontPicker() {
    this.show = false;

    window.removeEventListener('resize', this.listenerResize);
    document.removeEventListener('mouseup', this.listenerMouseDown);
  }

  isFontAvailable(font: Font) {
    if (!this.testWidth) {
      this.testContainer.style.fontFamily = 'monospace';

      document.body.appendChild(this.testContainer);

      this.testWidth = this.testContainer.clientWidth;

      document.body.removeChild(this.testContainer);
    }

    this.testContainer.style.fontFamily = font.family + ', monospace';

    document.body.appendChild(this.testContainer);

    let width = this.testContainer.clientWidth;

    document.body.removeChild(this.testContainer);

    return width != this.testWidth;
  }

  uploadFontFiles() {
  }

  cancelFontSelect() {
    this.font = this.initialFont;

    this.closeFontPicker();
  }

  loadGoogleFonts(fonts: Font[]) {
    fonts.slice(0, this.fontAmount).forEach((font: any) => {
      if (font && font.files && !this.isFontAvailable(font)) {
        let style = font.styles.indexOf("regular") > -1 ? '' : ":"  + font.styles.find((x:any) => !isNaN(x));

        try {
          WebFont.load({
            google: {
              families: [font.family + ":" + style]
            }
          });
        } catch(e) {
          console.warn("Problem with loading font:", font);
        }
      }
    })
  }

  onFontStyleChange($event, font: Font) {
    let str = this.font.family + ":" +  $event.srcElement.value;

    if (font.files) {
      WebFont.load({
        google: {
          families: [str]
        }
      });
    }
  }

  createDialogBox(element, offset): any {
    return {
      top: element.getBoundingClientRect().top + (offset ? window.pageYOffset : 0),
      left: element.getBoundingClientRect().left + (offset ? window.pageXOffset : 0),
      width: element.offsetWidth,
      height: element.offsetHeight
    };
  }

  setDialogPosition() {
    var node = this.directiveElementRef.nativeElement, parentNode = null, position = 'static';

    while (node !== null && node.tagName !== 'HTML') {
      position = window.getComputedStyle(node).getPropertyValue("position");

      if (position !== 'static' && parentNode === null) {
        parentNode = node;
      }

      if (position === 'fixed') {
        break;
      }

      node = node.parentNode;
    }

    if (position !== 'fixed') {
      var boxDirective = this.createDialogBox(this.directiveElementRef.nativeElement, true);

      if (parentNode === null) { parentNode = node }

      let boxParent = this.createDialogBox(parentNode, true);

      this.top = boxDirective.top - boxParent.top;
      this.left = boxDirective.left - boxParent.left;
    } else {
      var boxDirective = this.createDialogBox(this.directiveElementRef.nativeElement, false);

      this.top = boxDirective.top;
      this.left = boxDirective.left;
      this.position = 'fixed';
    }

    if (this.fpPosition === 'left') {
      this.top += boxDirective.height * this.fpPositionOffset / 100 - this.dialogArrowOffset;
      this.left -= this.fpWidth + this.dialogArrowSize;
    } else if (this.fpPosition === 'top') {
      this.top -= this.fpHeight + this.dialogArrowSize;
      this.left += this.fpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
      this.arrowTop = this.fpHeight - 1;
    } else if (this.fpPosition === 'bottom') {
      this.top += boxDirective.height + this.dialogArrowSize;
      this.left += this.fpPositionOffset / 100 * boxDirective.width - this.dialogArrowOffset;
    } else {
      this.top += boxDirective.height * this.fpPositionOffset / 100 - this.dialogArrowOffset;
      this.left += boxDirective.width + this.dialogArrowSize;
    }
  }
}
