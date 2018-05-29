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

  constructor(private sanitizer: DomSanitizer,
    public electronService: ElectronService) {
  }

  get tweet(): string {
    return this._tweet;
  }

  @Input()
  set tweet(tweet: string) {
    console.log("NOTE_SELECT - " + tweet);
    this._tweet = tweet;
  }

  initializeTwitterJS(): void {
    !function(d,s,id){
        var js: any,
            fjs=d.getElementsByTagName(s)[0],
            p='https';
        if(!d.getElementById(id)){
            js=d.createElement(s);
            js.id=id;
            js.src=p+"://platform.twitter.com/widgets.js";
            fjs.parentNode.insertBefore(js,fjs);
        }
    }
    (document,"script","twitter-wjs");
  }

  ngOnInit() {
  }

  ngAfterViewInit () {
    this.initializeTwitterJS();
  }
  twitterLink(test: string) :SafeResourceUrl {
    console.log("MAKKING SAFE")
    return this.sanitizer.bypassSecurityTrustResourceUrl(test);
  }
  twitterVidUrl() :SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.tweet);
  }

  isInElectronMode() :boolean {
    return this.electronService.isElectron()
  }
}
