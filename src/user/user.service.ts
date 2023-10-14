// user.service.ts

import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  private users = [];

  createUser(user: CreateUserDto) {
    this.users.push(user);
    return user;
  }

  getUsers() {
    return this.users;
  }

  getUserById(id: number) {
    return this.users[id];
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    this.users[id] = { ...this.users[id], ...updateUserDto };
    return this.users[id];
  }

  deleteUser(id: number) {
    const deletedUser = this.users[id];
    this.users.splice(id, 1);
    return deletedUser;
  }
}
