import {
  Component,
  ElementRef,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import { User } from '../interfaces/user.interface';
import { UsersService } from '../services/users.service';
import { dropdownAnimation, fadeInAnimation, slideInOutAnimation } from '../animations';

@Component({
  selector: 'comment-form',
  templateUrl: './comment-form.component.html',
  styleUrls: ['./comment-form.component.css'],
  animations: [dropdownAnimation, slideInOutAnimation, fadeInAnimation] 
})
export class CommentFormComponent {
  allUsers: User[] = [];
  filteredUsers: User[] = [];
  currentInput = '';
  showUserList = false;
  lastCursorIndex = 0;

  faPlusCircle = faPlusCircle;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.allUsers = this.usersService.getUsers();
    this.filteredUsers = this.allUsers;
  }

  @Output() formEscaped = new EventEmitter();
  @Output() commentAdded = new EventEmitter<string>();

  @ViewChild('commentInput', { static: true }) commentInput!: ElementRef;

  setCommentInput(value: string) {
    this.commentInput.nativeElement.innerHTML = value;
  }

getCaretPosition(): number {
  const editableDiv = this.commentInput.nativeElement;
  let caretPos = 0;
  const sel = window.getSelection();
  debugger
  // Check if there is a selection (there should be if the div is focused)
  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange(); // Clone the range

    // Set the start position to the very beginning of the contenteditable element
    preCaretRange.selectNodeContents(editableDiv);
    preCaretRange.setEnd(range.endContainer, range.endOffset); // Set the end position to the end of the selection
    caretPos = preCaretRange.toString().length; // The length of the string from the start to the range end is the cursor position
  }

  console.log('Caret position:', caretPos);
  return caretPos;
}

setCaretPosition(pos: number): void {
    const node = this.commentInput.nativeElement;
    if (!node.childNodes.length) {
      return; // If the div is empty, there's no text node to place the cursor in
    }

    const range = document.createRange(); // Create a range
    const sel = window.getSelection(); // Get the selection object
    let currentNode = null;
    let previousNode = null;

    // Traverse text nodes to find the correct position
    node.childNodes.forEach((childNode: any) => {
      if (childNode.nodeType === 3) { // Text node
        if (pos > childNode.length) {
          pos -= childNode.length;
          previousNode = childNode;
        } else {
          currentNode = childNode;
          return;
        }
      }
    });

    currentNode = currentNode || previousNode; // In case position is beyond last node
    range.setStart(currentNode ?? new Node(), pos); // Set the start of the range to the calculated position
    range.collapse(true); // Collapse the range to the start, effectively moving the cursor there

    if (sel) {
      sel.removeAllRanges(); // Remove any existing selections
      sel.addRange(range); // Add the new range
    }
  }


  onKeyUp(event: KeyboardEvent) {
    const cursorPosition = this.getCaretPosition();
    const value = this.commentInput.nativeElement.innerHTML;
    
    if (event.key === '@') {
      // Explicitly check if another list is already shown
      if (!this.showUserList) {
        this.filteredUsers = this.allUsers;
        this.showUserList = true;
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
        this.filteredUsers = this.allUsers.filter((user) =>
          user.name.toLowerCase().includes(searchTerm)
        );
      } else {
        this.showUserList = false;
      }
    }
  }

  selectUser(user: User): void {
    alert(user.name);
    const value = this.commentInput.nativeElement.innerHTML;
    const inputElement = this.commentInput.nativeElement;
    const cursorPosition = this.getCaretPosition();
    
    // Find the position of the last '@' before the cursor
    const indexOfAtSign = value.lastIndexOf('@', cursorPosition - 1);

    if (indexOfAtSign !== -1) {
      // Replace from '@' to the current cursor position with '@username '
      this.setCommentInput(`${value.slice(0, indexOfAtSign)}<b>@${user.name}</b>${value.slice(cursorPosition)}`);

      // Update view model
      this.filteredUsers = this.allUsers;
      this.showUserList = false;

      // Focus the input
      inputElement.focus();

      // Calculate the new cursor position
      const newCursorPosition = indexOfAtSign + user.name.length + 2; // +2 accounts for '@'
      setTimeout(() => {
        const test = indexOfAtSign
        debugger
        this.setCaretPosition(newCursorPosition);
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
