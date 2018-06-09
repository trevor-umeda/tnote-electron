export class Note {
  id: number;
  title: string;
  text: string;
  tag: string;
  created: Date;
  noteId: number;
  topicId: number;
  children: Note[];

  constructor(title: string, text: string) {
    this.title = title;
    this.text = text;
  }
}
