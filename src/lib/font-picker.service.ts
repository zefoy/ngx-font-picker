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
   * Return all fonts avaliable from google fonts, may have sort parameter:
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
   * Return observable of the requested font.
   */

  public getRequestedFont(family: string): Observable<Font> {
    const requestUrl = 'https://fonts.googleapis.com/css?family=' + family;

    return <Observable<Font>> this.http.get(requestUrl).pipe(
      catchError(this.handleHttpError)
    );
  }

  /**
   * Handler for possible http request errors.
   */

  private handleHttpError(error: any) {
    console.error(error);

    const errMsg = (error.error instanceof Error) ? error.error.message :
      (error.status || 'Unknown error');

    return Observable.throw(errMsg);
  }
}
