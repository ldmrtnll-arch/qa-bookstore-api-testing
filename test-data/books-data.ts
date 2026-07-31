export const validBook = {
  isbn: '9781449325862',
  title: 'Git Pocket Guide',
  author: 'Richard E. Silverman',
  publisher: "O'Reilly Media",
};

export const unavailableBook = {
  isbn: '9780000000000',
  expectedError: {
    code: '1205',
    message: 'ISBN supplied is not available in Books Collection!',
  },
};