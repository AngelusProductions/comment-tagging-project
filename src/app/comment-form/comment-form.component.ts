import { Component, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { UsersService } from '../services/users.service';
import { User } from '../interfaces/user.interface';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent {
  users: User[] = [];
  filteredUsers: User[] = [];
  currentInput = '';
  previousInput = '';
  showUserList = false;
  dropdownPositionLeft = 0;

  faPlusCircle = faPlusCircle;

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.users = this.usersService.getUsers();
    this.filteredUsers = this.users;
  }
    
  @Output() formEscaped = new EventEmitter();
  @Output() commentAdded = new EventEmitter<string>();

  @ViewChild('commentInput', { static: true }) commentInput!: ElementRef;

  onKeyUp(event: KeyboardEvent) {
    const value = this.currentInput;
    const previousValue = this.previousInput;
    const cursorPosition = this.commentInput.nativeElement.selectionStart;
    
    if (event.key === 'Backspace' && this.showUserList
      && (previousValue.lastIndexOf('@') === previousValue.length - 1)) {
      this.showUserList = false;
    }

    if (event.key === 'Escape') {
      this.showUserList = false
      this.formEscaped.emit();
    } else if (event.key === 'Enter') {
      this.addComment()
    } else if (event.key === '@') {
      this.showUserList = true
      this.dropdownPositionLeft = this.calculateDropdownPositionLeft(cursorPosition)
    } else if (this.showUserList) {
      const indexOfAtSign = value.lastIndexOf('@', cursorPosition)
      if (indexOfAtSign !== -1) {
        const searchTerm = value
          .substring(indexOfAtSign + 1, cursorPosition)
          .toLowerCase()
        this.filteredUsers = this.users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm)
        )
      }
    }

    this.previousInput = value;
  }

  calculateDropdownPositionLeft(cursorPosition: number): number {
    const commentInputRect = this.commentInput.nativeElement.getBoundingClientRect();
    const commmentInputSelectionStart = this.commentInput.nativeElement.selectionStart;

    const commentInputWidth = commentInputRect.width;
    // debugger
    
    const dropdownPositionLeft = commentInputRect.left + (commmentInputSelectionStart) * 8.318 + 2;
    
    return dropdownPositionLeft;
  }

  selectUser(user: User) {
    alert(user.name);
    this.currentInput += `${user.name} `;
    this.previousInput = this.currentInput;
    this.showUserList = false;
  }

  addComment() {
    if (!this.currentInput.trim()) return;
    this.commentAdded.emit(this.currentInput);
    this.currentInput = '';
  }
}
