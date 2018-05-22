import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, of , throwError} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Note } from './note';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private notesUrl = 'https://tnoteserver.herokuapp.com/api/notes';  // URL to web api

  constructor(private http: HttpClient) { }

  /** GET Notes from the server */
  getNotes (): Observable<Note[]> {
    console.log("NOTE_SERVICE - getting notes")
    const notes = this.http.get<Note[]>(this.notesUrl);
    console.log(notes)
    return notes;
  }

  /** POST: add a new note to the server */
  addNote (note: Note): Observable<Note> {
    console.log("Adding new note ", note);
    return this.http.post<Note>(this.notesUrl, JSON.stringify(note), httpOptions).pipe(
       catchError(this.handleError)
    );
  }

  /** DELETE: delete the note from the server */
  deleteNote (note: Note | number): Observable<Note> {
    const id = typeof note === 'number' ? note : note.id;
    const url = `${this.notesUrl}/${id}`;

    return this.http.delete<Note>(url, httpOptions).pipe(
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
