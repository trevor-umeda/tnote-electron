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
  recentlySelected: string;

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
    this.recentlySelected = "topic";
  }

  ngOnInit() {
    this.getNotes();
    this.selectedTopicNotes = new Array();
    this.recentlySelected = "";
  }

  getNotes(): void {
    this.noteService.getNotes()
    .subscribe(notes => this.notes = notes);
  }

  selectNote(note: Note): void {
    console.log("Making a new note for ", note)
    this.selectedNote = note;
    this.recentlySelected = "note";
  }

  save(noteTitle: string, noteText: string): void {
    console.log(noteTitle + " - " + noteText);
    noteTitle = noteTitle.trim();
    if (!noteTitle) { return; }

    let newNote = new Note(noteTitle, noteText);
    if(this.recentlySelected === "note" && this.selectedNote != undefined) {
        newNote.noteId = this.selectedNote.id
    } else {
      newNote.topicId = this._topic.id;
    }
    this.noteService.addNote( newNote )
      .subscribe(note => {
        if(this.recentlySelected === "note") {
          this.selectedNote.children.push(newNote)
        } else {
          this.selectedTopicNotes.push(newNote);
        }
      });
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
    if(parentNote == undefined) {
      this.notes = this.notes.filter(n => n !== note);
    } else {
      parentNote.children = parentNote.children.filter(n => n !== note);
    }
    this.noteService.deleteNote(note).subscribe();
  }
}
