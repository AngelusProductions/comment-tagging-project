import { Component, OnInit } from '@angular/core';
import { faCameraAlt } from '@fortawesome/free-solid-svg-icons';
import { faComment, faTimesRectangle } from '@fortawesome/free-regular-svg-icons';

import { CommentsService } from '../comments.service';
import { Comment } from '../interfaces/comment.interface';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  showCommentForm = false;
  comments: Comment[] = [];

  faComment = faComment;
  faCamera = faCameraAlt;
  faTimes = faTimesRectangle;

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    this.comments = this.commentsService.getComments();
  }

  onCommentAdded(comment: string) {
    this.showCommentForm = false;
    this.comments.push({
      commentID: this.comments.length + 1,
      text: comment,
      author: 'System',
      timestamp: new Date(),
    })
  }
}