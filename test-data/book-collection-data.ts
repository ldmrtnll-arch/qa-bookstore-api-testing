export const userNotAuthorizedError = {
  code: '1200',
  message: 'User not authorized!',
};

export const duplicatedBookError = {
  code: '1210',
  message: "ISBN already present in the User's Collection!",
};

export const nonexistentBookIsbn =
  '9999999999999';

export const bookNotAvailableError = {
  code: '1205',
  message:
    'ISBN supplied is not available in Books Collection!',
};

export const bookNotInUserCollectionError = {
  code: '1206',
  message:
    "ISBN supplied is not available in User's Collection!",
};