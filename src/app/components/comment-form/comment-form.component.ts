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

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
})
export class CommentFormComponent {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  currentInput = '';
  showUserList = false;
  activeUserIndex = 0;
  faPlusCircle = faPlusCircle;

  @Output() formEscaped = new EventEmitter<void>();
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

  // Correct the event type here to 'Event'
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.currentInput = inputElement.value;
    this.updateFilteredUsers();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.showUserList) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        this.navigateUsers(event.key === "ArrowDown" ? -1 : 1);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (this.filteredUsers.length > 0) {
          this.selectUser(this.filteredUsers[this.activeUserIndex]);
        }
      } else if (event.key === 'Escape') {
        this.showUserList = false;
      }
    }
  }

  updateFilteredUsers(): void {
    const indexOfAt = this.currentInput.lastIndexOf('@');
    if (indexOfAt !== -1) {
      const searchTerm = this.currentInput
        .substring(indexOfAt + 1)
        .toLowerCase();
      this.filteredUsers = this.allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm)
      );
      this.showUserList = true;
      this.activeUserIndex = 0;
    } else {
      this.showUserList = false;
    }
  }

  handleListKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault(); // Prevent the default action to stop window scrolling
      // Pass 1 for down and -1 for up
      this.navigateUsers(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter' && this.showUserList) {
      event.preventDefault(); // Prevent form submission
      if (this.filteredUsers.length > 0) {
        this.selectUser(this.filteredUsers[this.activeUserIndex]);
      }
    } else if (event.key === 'Escape') {
      this.showUserList = false;
    }
  }

  navigateUsers(direction: number): void {
    const maxIndex = this.filteredUsers.length - 1;
    if (direction === 1 && this.activeUserIndex < maxIndex) {
      this.activeUserIndex++;
    } else if (direction === -1 && this.activeUserIndex > 0) {
      this.activeUserIndex--;
    }
    this.focusActiveUser();
  }

  focusActiveUser(): void {
    const list = this.userList.nativeElement;
    const activeItem = list.children[this.activeUserIndex] as HTMLElement;
    if (activeItem) {
      activeItem.focus();
    }
  }

  selectUser(user: User): void {
    const indexOfAt = this.currentInput.lastIndexOf('@');
    this.currentInput = `${this.currentInput.substring(0, indexOfAt)}@${
      user.name
    } `;
    this.commentInput.nativeElement.focus();
    this.showUserList = false;
    setTimeout(() => {
      this.commentInput.nativeElement.setSelectionRange(
        this.currentInput.length,
        this.currentInput.length
      );
    }, 0);
  }

  addComment(): void {
    if (!this.currentInput.trim()) return;
    this.commentAdded.emit(this.currentInput);
    this.currentInput = '';
    this.showUserList = false;
  }
}
