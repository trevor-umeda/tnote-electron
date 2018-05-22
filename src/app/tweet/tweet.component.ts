import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, AfterViewInit} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})

export class TweetComponent implements OnInit, AfterViewInit {

  @Input()
  tweet: string;

  constructor(private sanitizer: DomSanitizer) { }

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

  twitterVidUrl() :SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.tweet);
  }
}
