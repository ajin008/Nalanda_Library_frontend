export interface signupProp {
  name: string;
  email: string;
  password: string;
}

export interface loginProp {
  email: string;
  password: string;
}
export const signupUser = async (data: signupProp) => {
  const finalData = { ...data, role: "user" };
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(finalData),
    }
  );

  return result.json();
};

export const loginUser = async (data: loginProp) => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  return result.json();
};

export const Logout = async () => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  if (!result.ok) throw new Error("server error");
  return result.json();
};

export const signupAdmin = async (data: signupProp) => {
  const finalData = { ...data, role: "admin" };

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/signup`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(finalData),
    }
  );

  return result.json();
};

export const loginAdmin = async (data: loginProp) => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    }
  );

  const res = result.json();
  console.log("data from login admin", res);

  return res;
};

export const logoutAdmin = async () => {
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  return result.json();
};
