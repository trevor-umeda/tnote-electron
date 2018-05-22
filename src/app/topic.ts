export class Topic {
  id: number;
  title: string;
  description: string;
  authorId: number;

  constructor(authorId: number, title: string) {
    this.authorId = authorId;
    this.title = title;
  }
}
