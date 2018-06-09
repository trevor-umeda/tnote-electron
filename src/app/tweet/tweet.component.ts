import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, AfterViewInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ElectronService } from '../providers/electron.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})

export class TweetComponent implements OnInit, AfterViewInit {

  private _tweet: string;
  showTweet: boolean;

  constructor(private sanitizer: DomSanitizer,
    public electronService: ElectronService) {
  }

  get tweet(): string {
    return this._tweet;
  }

  @Input()
  set tweet(tweet: string) {
    console.log("NOTE_SELECT - " + tweet);
    this.initializeTwitterJS();
    this._tweet = tweet;
  }

  initializeTwitterJS(): void {
    if(!this.isInElectronMode()) {
      setTimeout(function() {
      (<any>window).twttr = (function(d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0],
          t = (<any>window).twttr || {};
        if (d.getElementById(id)) return t;
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);

        t._e = [];
        t.ready = function(f) {
          t._e.push(f);
        };

        return t;
      }(document, 'script', 'twitter-wjs'));
      if((<any>window).twttr.ready())
      (<any>window).twttr.widgets.load(); }, 100);
    }

  }
  ngOnInit() {
    this.showTweet = false;
  }

  ngAfterViewInit () {
    this.initializeTwitterJS();
  }

  twitterVidUrl() :SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.tweet);
  }

  isInElectronMode() :boolean {
    return this.electronService.isElectron()
  }

  openTweet() :void {
    console.log("Click twitter event")
    this.showTweet = !this.showTweet;
    this.initializeTwitterJS();
  }
}
