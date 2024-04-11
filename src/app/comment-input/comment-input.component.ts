import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { UsersService } from '../users.service'
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'comment-input',
  templateUrl: './comment-input.component.html',
  styleUrls: ['./comment-input.component.css']
})
export class CommentInputComponent implements OnInit {

  users: User[] = [];
  newComment: string = '';

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.users = this.usersService.getUsers();
  }
    
  @Output() commentAdded = new EventEmitter<string>();

  addComment() {
    if (!this.newComment.trim()) return;
    this.commentAdded.emit(this.newComment);
    this.newComment = '';
  }
}
