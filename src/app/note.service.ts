import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of , throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Note } from './note';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notesUrl = 'https://tnoteserver.herokuapp.com/api/notes';  // URL to web api

  constructor(private http: HttpClient,
  private messageService: MessageService) { }

  /** GET Notes from the server */
  getNotes (): Observable<Note[]> {
    console.log("NOTE_SERVICE - getting notes")
    const notes = this.http.get<Note[]>(this.notesUrl+"?page=0&size=50")
      .pipe(
        catchError(this.handleError('getNotes', []))
      );
    return notes;
  }

  getNotesByTopic (topicId: number): Observable<Note[]> {
    console.log("NOTE_SERVICE - getting notes")
    const notes = this.http.get<Note[]>(this.notesUrl+"?topicId="+topicId+"&page=0&size=50")
    .pipe(
      catchError(this.handleError('getNotes', []))
    );;;
    return notes;
  }

  /** POST: add a new note to the server */
  addNote (note: Note): Observable<Note> {
    console.log("Adding new note ", note);
    return this.http.post<Note>(this.notesUrl, JSON.stringify(note), httpOptions).pipe(
       catchError(this.handleError<any>('addNote'))
    );
  }

  /** PUT: update the hero on the server */
  updateNote (note: Note): Observable<any> {
    console.log("Editing note ", note)
    return this.http.put(this.notesUrl, JSON.stringify(note), httpOptions).pipe(
      catchError(this.handleError<any>('updateNote'))
    );
  }

  /** DELETE: delete the note from the server */
  deleteNote (note: Note | number): Observable<Note> {
    const id = typeof note === 'number' ? note : note.id;
    const url = `${this.notesUrl}/${id}`;

    return this.http.delete<Note>(url, httpOptions).pipe(
      catchError(this.handleError<any>('deleteNote'))
    );
  }
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
   // private handleError(error: HttpErrorResponse) {
   //   if (error.error instanceof ErrorEvent) {
   //     // A client-side or network error occurred. Handle it accordingly.
   //     console.error('An error occurred:', error.error.message);
   //   } else {
   //     // The backend returned an unsuccessful response code.
   //     // The response body may contain clues as to what went wrong,
   //     console.error(
   //       `Backend returned code ${error.status}, ` +
   //       `body was: ${error.error}`);
   //   }
   //   // return an observable with a user-facing error message
   //   return throwError(
   //     'Something bad happened; please try again later.');
   // };

   /**
    * Handle Http operation that failed.
    * Let the app continue.
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
   private handleError<T> (operation = 'operation', result?: T) {
     return (error: any): Observable<T> => {

       // TODO: send the error to remote logging infrastructure
       console.error(error); // log to console instead

       // TODO: better job of transforming error for user consumption
       this.log(`${operation} failed: ${error.message}`);

       // Let the app keep running by returning an empty result.
       return of(result as T);
     };
   }

   /** Log a HeroService message with the MessageService */
   private log(message: string) {
     this.messageService.add('HeroService: ' + message);
   }

}
