import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, AfterViewInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { Topic } from '../topic';
import { Note } from '../note';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  private _topic: Topic;
  private notes: Note[];
  private selectedTopicNotes: Note[];
  selectedNote: Note;
  topNote: Note;

  constructor(
    private noteService: NoteService,
    private sanitizer: DomSanitizer
  ){ }


  get topic(): Topic {
    return this._topic;
  }

  @Input()
  set topic(topic: Topic) {
    console.log("TOPIC_SELECT - " + topic);
    this._topic = topic;
    this.selectedTopicNotes = new Array();
    if(this.notes != undefined) {
      for (let note of this.notes) {
        if(note.topicId === topic.id) {
          this.selectedTopicNotes.push(note);
        }
      }
    }
  }

  ngOnInit() {
    this.getNotes();
    this.selectedTopicNotes = new Array();

  }

  getNotes(): void {
    this.noteService.getNotes()
    .subscribe(notes => this.notes = notes);
  }

  selectTopNote(note: Note): void {
    console.log("CHOSE TOP NOTE", note);
    this.topNote = note;
    this.selectNote(note);
  }

  selectNote(note: Note): void {
    console.log("Select a new note for ", note)
    this.selectedNote = note;
  }

  saveTopNote(noteTitle: string, noteText: string): void {
    console.log(noteTitle + " - " + noteText);
    noteTitle = noteTitle.trim();
    if (!noteTitle) { return; }

    let newNote = new Note(noteTitle, noteText);
    newNote.topicId = this._topic.id;

    this.noteService.addNote( newNote )
      .subscribe(note => {
        this.selectedTopicNotes.push(newNote);
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
      });
  }

  deleteNote(note: Note, parentNote: Note): void {
    console.log("removing a parent node");
    this.selectedTopicNotes = this.selectedTopicNotes.filter(n => n !== note);
    this.noteService.deleteNote(note).subscribe();
  }
}
