import { Injectable } from '@angular/core';

import usersList from '../data/users';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: User[] = usersList;

  constructor() { }

  getUsers() {
    return this.users;
  }
}