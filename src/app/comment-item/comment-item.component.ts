import { Component, Input } from '@angular/core';
import { faComment } from '@fortawesome/free-regular-svg-icons';

import { Comment } from '../interfaces/comment.interface';

@Component({
  selector: 'comment-item',
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.css'
})
export class CommentItemComponent {
  @Input() comment!: Comment;
  faComment = faComment;
}
