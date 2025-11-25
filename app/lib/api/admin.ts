export const getAdminStatsAPI = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  return res.json();
};

export const getAllUsersAPI = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/all-users`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return res.json();
};

export const getMostBorrowedBooks = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/borrow/most-borrowed`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return res.json();
};
