import { Component, OnInit } from '@angular/core';
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

  addComment() {
    if (!this.newComment.trim()) return;
    console.log(this.newComment); // Replace this with actual logic to add the comment
    this.newComment = ''; // Reset the input field after adding the comment
  }
}
