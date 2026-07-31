import type { Book } from './book';

export interface CreatedUserResponse {
  userID: string;
  username: string;
  books: Book[];
}