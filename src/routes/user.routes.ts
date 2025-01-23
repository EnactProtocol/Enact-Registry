import { Elysia } from 'elysia';
import { UserController } from '../controllers/user.controller';

const userController = new UserController();

export const userRoutes = new Elysia({ prefix: '/users' })
  .get('/', (context) => userController.getUsers())
  .post('/', (context) => userController.createUser(context));
