import { BookFormData } from "../api/books";

export const createBookGraphQL = async (Data: BookFormData) => {
  const query = `
    mutation CreateBook(
      $title: String!,
      $author: String!,
      $isbn: String!,
      $publicationDate: String!,
      $genre: String!,
      $copies: Int!,
      $description: String,
      $publisher: String
    ) {
      createBook(
        title: $title,
        author: $author,
        isbn: $isbn,
        publicationDate: $publicationDate,
        genre: $genre,
        copies: $copies,
        description: $description,
        publisher: $publisher
      ) {
        success
        message
      }
    }
  `;

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      query,
      variables: Data,
    }),
  });

  return result.json();
};

export const DeleteBookGraphQl = async (bookId: string) => {
  const query = `
      mutation DeleteBook($bookId: ID!) {
        deleteBook(bookId: $bookId) {
          success
          message
        }
      }
    `;

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      query,
      variables: { bookId },
    }),
  });

  return result.json();
};

export const updateBookGraphQl = async (bookId: string, data: BookFormData) => {
  const query = `
      mutation UpdateBook(
        $id: ID!,
        $title: String,
        $author: String,
        $isbn: String,
        $publicationDate: String,
        $genre: String,
        $copies: Int,
        $description: String,
        $publisher: String
      ) {
        updateBook(
          id: $id,
          title: $title,
          author: $author,
          isbn: $isbn,
          publicationDate: $publicationDate,
          genre: $genre,
          copies: $copies,
          description: $description,
          publisher: $publisher
        ) {
          success
          message
        }
      }
    `;

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      query,
      variables: { id: bookId, ...data },
    }),
  });

  return result.json();
};
