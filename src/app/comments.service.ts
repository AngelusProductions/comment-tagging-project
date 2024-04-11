import { Injectable } from '@angular/core';

import commentsList from './data/comments';
import { Comment } from './interfaces/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private comments: Comment[] = commentsList;

  constructor() { }

  getComments() {
    return this.comments;
  }
}