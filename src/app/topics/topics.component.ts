import { Component, OnInit } from '@angular/core';

import { Topic } from '../topic';
import { TopicService } from '../topic.service';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent implements OnInit {
  topics: Topic[];
  selectedTopic: Topic;

  constructor(private topicService: TopicService) { }

  ngOnInit() {
    this.getTopics();
  }

  getTopics(): void {
    this.topicService.getTopics()
    .subscribe(topics => this.topics = topics);
  }

  openTopic(topic: Topic): void {
    console.log(topic);
    this.selectedTopic = topic;

  }

  addTopic(topicTitle: string): void {
    if (!topicTitle) { return; }
    let newTopic = new Topic(951, topicTitle);
    this.topicService.addTopic( newTopic )
      .subscribe(topic => {
        this.topics.push(topic);
      });
  }
}
