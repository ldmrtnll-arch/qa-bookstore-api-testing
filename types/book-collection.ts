export interface CollectionOfIsbn {
  isbn: string;
}

export interface AddBooksRequest {
  userId: string;
  collectionOfIsbns: CollectionOfIsbn[];
}

export interface AddBooksResponse {
  books: CollectionOfIsbn[];
}