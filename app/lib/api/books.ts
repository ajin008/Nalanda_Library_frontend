interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publicationDate: string;
  genre: string;
  copies: number;
  description?: string;
  publisher?: string;
}

export const createBook = async (data: BookFormData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/create`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Failed to create book");

  return res.json();
};

export const getAllBooks = async (page = 1, limit = 10) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/getAllBook?page=${page}&limit=${limit}`,
    { method: "GET", credentials: "include" }
  );

  return res.json();
};

export const deleteBook = async (bookId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/deleteById/${bookId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );
  return res.json();
};

export const getBookById = async (bookId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/getById/${bookId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return res.json();
};

export const updateBook = async (bookId: string, data: BookFormData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/update/${bookId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  return res.json();
};

export const searchBooksAPI = async (search: string, genre: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/books/search?q=${search}&genre=${genre}`,
    { credentials: "include" }
  );
  const data = await res.json();
  console.log("data received :", data);
  return data;
};

export const borrowBook = async (bookId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/borrow/borrow`,
    {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookId }), // only bookId
    }
  );

  return res.json();
};

export const getCurrentBorrowed = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/borrow/currentBorrowed`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return res.json();
};

export const returnBook = async (bookId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/borrow/return`,
    {
      method: "POST",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookId }),
    }
  );
  return res.json();
};

export const getBorrowStats = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/borrow/stats`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return res.json();
};
