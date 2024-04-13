import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
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
  lastCursorIndex = 0;

  faPlusCircle = faPlusCircle;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.users = this.usersService.getUsers();
    this.filteredUsers = this.users;
  }

  @Output() formEscaped = new EventEmitter();
  @Output() commentAdded = new EventEmitter<string>();

  @ViewChild('commentInput', { static: true }) commentInput!: ElementRef;

  onKeyUp(event: KeyboardEvent) {
    const cursorPosition = this.commentInput.nativeElement.selectionStart;
    const value = this.currentInput;

    if (event.key === '@') {
      // Explicitly check if another list is already shown
      if (!this.showUserList) {
        this.showUserList = true;
        this.calculateDropdownPositionLeft(cursorPosition);
      }
    } else if (event.key === 'Enter') {
      this.addComment();
    } else if (event.key === 'Escape') {
      this.formEscaped.emit();
    } else if (this.showUserList) {
      // Find the position of the last '@' before the cursor
      const indexOfAtSign = value.lastIndexOf('@', cursorPosition - 1);
      if (indexOfAtSign !== -1) {
        // Filter users based on the search term
        const searchTerm = value
          .substring(indexOfAtSign + 1, cursorPosition)
          .toLowerCase();
        this.filteredUsers = this.users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm)
        );
      } else {
        this.showUserList = false;
      }
    }

    this.previousInput = value;
  }

  updateFilteredUsers(
    value: string,
    indexOfAtSign: number,
    cursorPosition: number
  ) {}

  calculateDropdownPositionLeft(cursorPosition: number): number {
    const commentInputRect =
      this.commentInput.nativeElement.getBoundingClientRect();
    const commmentInputSelectionStart =
      this.commentInput.nativeElement.selectionStart;

    const commentInputWidth = commentInputRect.width;
    // debugger

    const dropdownPositionLeft =
      commentInputRect.left + commmentInputSelectionStart * 7 + 5;

    return dropdownPositionLeft;
  }

  selectUser(user: User): void {
    alert(user.name);
    const inputElement = this.commentInput.nativeElement;
    const cursorPosition = inputElement.selectionStart;
    const value = this.currentInput;

    // Find the position of the last '@' before the cursor
    const indexOfAtSign = value.lastIndexOf('@', cursorPosition - 1);

    if (indexOfAtSign !== -1) {
      // Replace from '@' to the current cursor position with '@username '
      this.currentInput = `${value.slice(0, indexOfAtSign)}@${
        user.name
      }${value.slice(cursorPosition)}`;

      // Update view model
      this.filteredUsers = this.users;
      this.previousInput = this.currentInput;
      this.showUserList = false;

      // Focus the input
      inputElement.focus();

      // Calculate the new cursor position
      const newCursorPosition = indexOfAtSign + user.name.length + 1; // +2 accounts for '@'
      setTimeout(() => {
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  }

  addComment() {
    if (!this.currentInput.trim()) return;
    this.commentAdded.emit(this.currentInput);
    this.currentInput = '';
  }
}
