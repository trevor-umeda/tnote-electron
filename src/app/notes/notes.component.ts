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
  private selectedTopicNotes: Note[];
  topNote: Note;
  selectedTag: string;

  // Caches
  cache: {[key: number]: Note[]};
  tagCache: {[key: number]: string[]};

  constructor(
    private noteService: NoteService,
    private sanitizer: DomSanitizer
  ){ }

  ngOnInit() {
    console.log("NOTES_NG_ON_INIT");
    this.selectedTopicNotes = new Array();
    this.selectedTag = "";
    this.cache = {};
    this.tagCache = {};
  }

  get topic(): Topic {
    return this._topic;
  }

  @Input()
  set topic(topic: Topic) {
    console.log("TOPIC_SELECT - " , topic);
    this._topic = topic;
    this.selectedTopicNotes = new Array();
    if(topic) {
      console.log("Getting notes by topic id ", topic.id)
      if(this.cache[topic.id]) {
        console.log("Accessing cache");
        this.selectedTopicNotes = this.cache[topic.id]
      } else {
        this.noteService.getNotesByTopic(topic.id)
        .subscribe(notes => this.loadNotes(topic.id, notes));
      }
    }
  }

  loadNotes(topicId: number, notes: Note[]): void {
    this.selectedTopicNotes = notes;
    this.selectedTopicNotes.forEach((value) => {
      if(value.children) {
        let tagList: string[] = [];
        value.children.forEach((child) => {
          if(child.tag && !tagList.includes(child.tag)){
            tagList.push(child.tag)
          }
        });
        this.tagCache[value.id] = tagList
      }
    })
    this.cache[topicId] = notes;
    console.log(this.tagCache)
  }

  reloadCache(noteId: number): void {
    console.log(noteId);
    console.log(this.tagCache[noteId])
    console.log(this.selectedTopicNotes);
    this.selectedTopicNotes.forEach((value) => {
      if(value.children && noteId == value.id) {
        let tagList: string[] = [];
        value.children.forEach((child) => {
          if(child.tag && !tagList.includes(child.tag)){
            tagList.push(child.tag)
          }
        });
        this.tagCache[value.id] = tagList
      }
    })
    console.log("CLEARING TAG CACHE");
  }

  selectTopNote(note: Note): void {
    console.log("CHOSE TOP NOTE", note);
    this.topNote = note;
    this.selectedTag = "";
  }

  selectTag(tag: string): void {
    this.selectedTag = tag;
  }

  collectTags(note: Note): string[] {
    return this.tagCache[note.id];
  }

  saveTopNote(noteTitle: string, noteText: string): void {
    console.log(noteTitle + " - " + noteText);
    noteTitle = noteTitle.trim();
    if (!noteTitle) { return; }

    let newNote = new Note(noteTitle, noteText);
    newNote.children = []
    newNote.topicId = this._topic.id;
    this.noteService.addNote( newNote )
      .subscribe(note => {
        this.selectedTopicNotes.push(newNote);
      });
      this.cache[this._topic.id] = null;
  }

  deleteNote(note: Note, parentNote: Note): void {
    console.log("removing a parent node");
    this.selectedTopicNotes = this.selectedTopicNotes.filter(n => n !== note);
    this.noteService.deleteNote(note).subscribe();
  }

  // Deprecated code graveyard

  // This is called alot so is potentially pretty a bad performance point.
  // let tagList: string[] = [];
  // console.log("COLLECTING_TAGS for note " )
  // note.children.forEach((value) => {
  //   // console.log(value);
  //   if(value.tag && !tagList.includes(value.tag)){
  //     tagList.push(value.tag)
  //   }
  // });

  // save(noteTitle: string, noteText: string): void {
  //   console.log(noteTitle + " - " + noteText);
  //   noteTitle = noteTitle.trim();
  //   if (!noteTitle) { return; }
  //
  //   let newNote = new Note(noteTitle, noteText);
  //   newNote.children = []
  //   newNote.noteId = this.selectedNote.id
  //   this.noteService.addNote( newNote )
  //     .subscribe(note => {
  //       this.selectedNote.children.push(newNote)
  //     });
  // }

}
