import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { User } from '../../models/user.interface';
import { UsersService } from '../../services/users.service';
import { dropdownAnimation, fadeInAnimation, slideInOutAnimation } from '../../animations';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
  animations: [dropdownAnimation, slideInOutAnimation, fadeInAnimation] 
})
export class CommentFormComponent {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  currentInput = '';
  showUserList = false;
  faPlusCircle = faPlusCircle;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.allUsers = this.usersService.getUsers();
    this.filteredUsers = this.allUsers;
  }

  @Output() formEscaped = new EventEmitter();
  @Output() commentAdded = new EventEmitter<string>();

  // Our template reference variable is used to access the input element
  @ViewChild('commentInput', { static: true }) commentInput!: ElementRef;

  onKeyUp(event: KeyboardEvent) {
    const value = this.currentInput;
    const cursorPosition = this.commentInput.nativeElement.selectionStart;

    if (event.key === '@') {
      // Explicitly check if another list is already shown
      if (!this.showUserList) {
        this.filteredUsers = this.allUsers;
        this.showUserList = true;
      }
    } else if (event.key === 'Enter') this.addComment();
      else if (event.key === 'Escape') this.formEscaped.emit();
    else if (this.showUserList) {
      // Find the position of the last '@' before the cursor
      const indexOfAtSign = value.lastIndexOf('@', cursorPosition - 1);
      if (indexOfAtSign !== -1) {
        // Filter users based on the search term
        const searchTerm = value
          .substring(indexOfAtSign + 1, cursorPosition)
          .toLowerCase();
        this.filteredUsers = this.allUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm)
        );
      } else {
        // Hide the user list if the '@' sign is removed
        this.showUserList = false;
      }
    }
  }

  selectUser(user: User): void {
    alert(user.name);
    const value = this.currentInput;
    const inputElement = this.commentInput.nativeElement;
    const cursorPosition = inputElement.selectionStart;

    // Find the position of the last '@' before the cursor
    const indexOfAtSign = value.lastIndexOf('@', cursorPosition - 1);

    if (indexOfAtSign !== -1) {
      // Replace from '@' to the current cursor position with '@username'
      this.currentInput = `${value.slice(0, indexOfAtSign)}@${user.name}${value.slice(cursorPosition)}`;

      // Update view model
      this.filteredUsers = this.allUsers;
      this.showUserList = false;

      // Focus the input
      inputElement.focus();

      // Calculate the new cursor position
      const newCursorPosition = indexOfAtSign + user.name.length + 1; // +1 for the '@' sign
      setTimeout(() => {
        inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  }

  addComment() {
    // Don't add empty comments
    if (!this.currentInput.trim()) return;

    // Emit the comment to the parent component
    this.commentAdded.emit(this.currentInput);
  }
}
