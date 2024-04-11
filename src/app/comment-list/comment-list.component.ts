import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../comments.service';

@Component({
  selector: 'comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
  comments: any[] = [];

  constructor(private commentsService: CommentsService) { }

  ngOnInit(): void {
    this.comments = this.commentsService.getComments();
  }

  onSubmit($event: Event) {
    debugger
  }
}