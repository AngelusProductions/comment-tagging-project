import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../comments.service';
import { Comment } from '../interfaces/comment.interface';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  comments: Comment[] = [];

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    this.comments = this.commentsService.getComments();
  }

  onCommentAdded(comment: string) {
    this.comments.push({
      commentID: this.comments.length + 1,
      text: comment,
      author: 'User'
    })
  }
}