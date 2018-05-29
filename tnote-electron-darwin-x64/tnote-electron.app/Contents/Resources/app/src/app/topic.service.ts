import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of , throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Topic } from './topic';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  private topicsUrl = 'https://tnoteserver.herokuapp.com/api/topics';  // URL to web api
  private authorId = '951';
  constructor(private http: HttpClient) { }

  /** GET heroes from the server */
  getTopics (): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.topicsUrl + "?authorId=" + this.authorId);
  }

  addTopic (topic: Topic): Observable<Topic> {
    console.log("Adding new topic ", topic);
    return this.http.post<Topic>(this.topicsUrl, JSON.stringify(topic), httpOptions).pipe(
       catchError(this.handleError)
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
   private handleError(error: HttpErrorResponse) {
     if (error.error instanceof ErrorEvent) {
       // A client-side or network error occurred. Handle it accordingly.
       console.error('An error occurred:', error.error.message);
     } else {
       // The backend returned an unsuccessful response code.
       // The response body may contain clues as to what went wrong,
       console.error(
         `Backend returned code ${error.status}, ` +
         `body was: ${error.error}`);
     }
     // return an observable with a user-facing error message
     return throwError(
       'Something bad happened; please try again later.');
   };
}
