import type { Book } from './book';

export interface UserDetailsResponse {
  userId: string;
  username: string;
  books: Book[];
}