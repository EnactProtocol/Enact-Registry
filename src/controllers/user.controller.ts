import { Context } from 'elysia';
import type { User } from '../types';

export class UserController {
  async getUsers() {
    return {
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
      ]
    };
  }

  async createUser({ body }: Context) {
    const userData = body as User;
    return {
      message: 'User created successfully',
      user: userData
    };
  }
}