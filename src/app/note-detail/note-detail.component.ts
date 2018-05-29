import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, AfterViewInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Note } from '../note';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {

  private _note: Note;
  private selectedNote: Note;

  constructor(
    private noteService: NoteService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
  }

  get note(): Note {
    return this._note;
  }

  @Input()
  set note(note: Note) {
    console.log("NOTE_SELECT - " + note);
    this._note = note;
  }

  containsYoutube(text: string) :boolean {
    var re = /youtube/gi;
    return (text.search(re) > 0)
  }

  containsTwitter(text: string) :boolean {
    var re = /twitter/gi;
    // console.log("Looking at twitter " + text.search(re2) != -1)
    return (text.search(re) != -1)
  }

  vidUrl(text: string) :SafeResourceUrl {
    var re = /youtube/gi;
    if(text.search(re) > 0) {
      var video_id = text.split('v=')[1];
      var ampersandPosition = video_id.indexOf('&');
      if(ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
      }
      return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/"+video_id);
    }

    return text;
  }

  deleteNote(note: Note, parentNote: Note): void {
    console.log("Deletingn note")
    parentNote.children = parentNote.children.filter(n => n !== note);
    this.noteService.deleteNote(note).subscribe();
  }

  selectNote(note: Note): void {
    console.log("NOTE_DETAIL - Select a new note for ", note)
    this.selectedNote = note;
  }

  saveNewTopNote(noteTitle: string, noteText: string): void {
    console.log(noteTitle + " - " + noteText);
    noteTitle = noteTitle.trim();
    if (!noteTitle) { return; }

    let newNote = new Note(noteTitle, noteText);
    newNote.noteId = this._note.id
    
    this.noteService.addNote( newNote )
      .subscribe(note => {
          this._note.children.push(newNote)
          this.selectedNote = null;
      });
  }

  save(noteTitle: string, noteText: string): void {
    console.log(noteTitle + " - " + noteText);
    noteTitle = noteTitle.trim();
    if (!noteTitle) { return; }

    let newNote = new Note(noteTitle, noteText);
    newNote.noteId = this.selectedNote.id
    this.noteService.addNote( newNote )
      .subscribe(note => {
          this.selectedNote.children.push(newNote)
          this.selectedNote = null;
      });
  }

}
