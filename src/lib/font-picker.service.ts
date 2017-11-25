import * as WebFont from 'webfontloader';

import { Observable } from 'rxjs/Observable';

import { catchError, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { FONT_PICKER_CONFIG  } from './font-picker.interfaces';

import { FontPickerConfig, Font, GoogleFonts  } from './font-picker.interfaces';

@Injectable()
export class FontPickerService {
  private apiKey: string = '';

  private baseUrl: string = 'https://www.googleapis.com/webfonts/v1/webfonts';

  constructor( @Inject(FONT_PICKER_CONFIG) private config: FontPickerConfig, private http: HttpClient ) {
    this.apiKey = config.apiKey;
  }

  /**
   * Loads the given font from Google Web Fonts.
   */
  public loadFont(font: Font) {
    try {
      WebFont.load({
        google: {
          families: [font.family + ':' + font.style]
        }
      });
    } catch (e) {
      console.warn('Failed to load the font:', font);
    }
  }

  /**
   * Returns list of all fonts with given sort option:
   * date || alpha || style || trending || popularity
   */

  public getAllFonts(sort: string): Observable<GoogleFonts> {
    let requestUrl = this.baseUrl + '?key=' + this.apiKey;

    if (sort) {
      requestUrl = requestUrl.concat('&sort=' + sort);
    }

    return <Observable<GoogleFonts>> this.http.get(requestUrl).pipe(
      catchError(this.handleHttpError)
    );
  }

  /**
   * Returns font object for the requested font family.
   */

  public getRequestedFont(family: string): Observable<Font> {
    const requestUrl = 'https://fonts.googleapis.com/css?family=' + family;

    return <Observable<Font>> this.http.get(requestUrl).pipe(
      catchError(this.handleHttpError)
    );
  }

  /**
   * Handler method for all possible http request errors.
   */

  private handleHttpError(error: any) {
    console.error(error);

    const errMsg = (error.error instanceof Error) ? error.error.message :
      (error.status || 'Unknown error');

    return Observable.throw(errMsg);
  }
}
