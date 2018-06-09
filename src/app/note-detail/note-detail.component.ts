import { Component, OnInit, Output, Input, OnChanges, SimpleChanges, SimpleChange, AfterViewInit, EventEmitter} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Note } from '../note';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {

  @Output() clearTagCacheEvent = new EventEmitter<string>();

  private _note: Note;
  private _tag: string;
  private selectedNote: Note;
  private selectedTagNote: Note;
  private editingTag: boolean;

  constructor(
    private noteService: NoteService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.editingTag = false;
  }

  get note(): Note {
    return this._note;
  }

  @Input()
  set note(note: Note) {
    console.log("NOTE_SELECT - ", note);
    this._note = note;
  }

  get tag(): string {
    return this._tag;
  }

  @Input()
  set tag(tag: string) {
    console.log("TAG_SELECT - " + tag);
    this._tag = tag;
  }

  enableEditTag(note: Note) :void {
    console.log("Enabling editing tag");
    this.editingTag = true;
    this.selectedTagNote = note;
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

  addTag(note: Note, tag: string): void {
    note.tag = tag;
    this.editingTag = false;
    this.selectedTagNote = null;
    this.clearTagCacheEvent.next(this._note.id+"");
    this.noteService.updateNote(note)
     .subscribe();
  }

  selectNote(note: Note): void {
    console.log("NOTE_DETAIL - Select a new note for ", note)
    this.selectedNote = note;
    this.editingTag = false;
  }

  saveNote(noteTitle: string, noteText: string, isTopNote: boolean): void {
    console.log(noteTitle + " - " + noteText);
    noteTitle = noteTitle.trim();
    if (!noteTitle) { return; }
    let newNote = new Note(noteTitle, noteText);
    newNote.children = [];
    let noteToModify;

    if(isTopNote) {
      noteToModify = this._note;
    } else {
      noteToModify = this.selectedNote;
    }
    newNote.noteId = noteToModify.id;
    this.noteService.addNote( newNote )
    .subscribe(note => {
        noteToModify.children.push(newNote)
        this.selectedNote = null;
    });

    this.editingTag = false;
  }

  deleteNote(note: Note, parentNote: Note): void {
    console.log("Deletingn note")
    parentNote.children = parentNote.children.filter(n => n !== note);
    this.noteService.deleteNote(note).subscribe();
    this.editingTag = false;
  }
}
