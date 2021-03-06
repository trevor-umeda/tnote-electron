import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TopicsComponent } from './topics/topics.component';
import { NotesComponent } from './notes/notes.component';
import { TweetComponent } from './tweet/tweet.component';
import { NoteDetailComponent } from './note-detail/note-detail.component';

import { ElectronService } from './providers/electron.service';
import { WebviewDirective } from './webview.directive';
import { TagFilterPipe } from './note-detail/tag-filter.pipe';
import { MessagesComponent } from './messages/messages.component';


@NgModule({
  declarations: [
    AppComponent,
    TopicsComponent,
    NotesComponent,
    TweetComponent,
    NoteDetailComponent,
    WebviewDirective,
    TagFilterPipe,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ElectronService],
  bootstrap: [AppComponent]
})
export class AppModule { }
