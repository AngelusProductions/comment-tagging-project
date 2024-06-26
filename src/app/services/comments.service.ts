import { Injectable } from '@angular/core';

import commentsList from '../data/comments';
import { Comment } from '../models/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private comments: Comment[] = commentsList;

  constructor() { }

  getComments(): Comment[] {
    return this.comments;
  }
}