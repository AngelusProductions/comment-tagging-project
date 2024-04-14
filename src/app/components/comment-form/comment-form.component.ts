import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
  HostListener,
} from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../models/user.interface';
import { UsersService } from '../../services/users.service';
import {
  dropdownAnimation,
  fadeInAnimation,
  slideInOutAnimation,
} from '../../animations';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
  animations: [dropdownAnimation, fadeInAnimation, slideInOutAnimation],
})
export class CommentFormComponent {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  currentInput = '';
  showUserList = false;
  activeUserIndex = 0; // Active user index for keyboard navigation
  faPlusCircle = faPlusCircle;

  @Output() formEscaped = new EventEmitter();
  @Output() commentAdded = new EventEmitter<string>();

  @ViewChild('commentInput', { static: true })
  commentInput!: ElementRef<HTMLInputElement>;
  @ViewChild('userList', { static: false })
  userList!: ElementRef<HTMLUListElement>;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.allUsers = this.usersService.getUsers();
    this.filteredUsers = this.allUsers;
  }

  handleInputKeyDown(event: KeyboardEvent): void {
    if (event.key === '@' && !this.showUserList) {
      this.filteredUsers = this.allUsers;
      this.showUserList = true;
      this.activeUserIndex = 0;
      setTimeout(() => this.focusActiveUser(), 10);
    }
  }

  handleListKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateUsers(event.key);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.selectUser(this.filteredUsers[this.activeUserIndex]);
    }
  }

  focusActiveUser(): void {
    const items = this.userList.nativeElement.querySelectorAll('li');
    if (items.length > 0 && items[this.activeUserIndex]) {
      items[this.activeUserIndex].focus();
    }
  }

  navigateUsers(key: string): void {
    if (key === 'ArrowDown') {
      this.activeUserIndex = Math.min(
        this.activeUserIndex + 1,
        this.filteredUsers.length - 1
      );
    } else if (key === 'ArrowUp') {
      this.activeUserIndex = Math.max(this.activeUserIndex - 1, 0);
    }
    this.focusActiveUser();
  }

  updateFilteredUsers(cursorPosition: number): void {
    const indexOfAtSign = this.currentInput.lastIndexOf('@', cursorPosition - 1);
    if (indexOfAtSign !== -1) {
      const searchTerm = this.currentInput
        .substring(indexOfAtSign + 1, cursorPosition)
        .toLowerCase();
      this.filteredUsers = this.allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
      this.showUserList = true;
    } else {
      this.showUserList = false;
    }
  }

  selectUser(user: User): void {
    const value = this.currentInput;
    const inputElement = this.commentInput.nativeElement;
    const cursorPosition = this.commentInput.nativeElement.selectionStart;
    if (cursorPosition === null) {
      console.error('cursorPosition is null');
      return;
    }
    const indexOfAtSign = value.lastIndexOf('@', cursorPosition - 1);

    if (indexOfAtSign !== -1 && cursorPosition !== null) {
      this.currentInput = `${value.slice(0, indexOfAtSign)}@${
        user.name
      } ${value.slice(cursorPosition)}`;
      this.filteredUsers = this.allUsers;
      this.showUserList = false;
      inputElement.focus();
      const newCursorPosition = indexOfAtSign + user.name.length + 2; // +2 for '@' and space
      setTimeout(
        () =>
          inputElement.setSelectionRange(newCursorPosition, newCursorPosition),
        0
      );
    }
  }

  addComment(): void {
    if (!this.currentInput.trim()) return;
    this.commentAdded.emit(this.currentInput);
    this.currentInput = '';
    this.commentInput.nativeElement.blur();
  }
}
